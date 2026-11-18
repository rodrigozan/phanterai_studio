"""Offline behavioral checks: public transitions, retries, word floor and lost POST responses."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit, parse_qs

spec = importlib.util.spec_from_file_location('blog', Path(__file__).with_name('blog-youtube.py'))
blog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blog)


def video(privacy='public', published='2026-11-18T20:16:00Z'):
    return {'id': 'CvBU1nv7W7w', 'title': 'Tutorial de IA', 'privacyStatus': privacy,
            'publishedAt': published, 'description': '', 'videoPath': ''}


def article(words=510):
    return {'title': 'Tutorial', 'excerpt': 'Aprenda com o vídeo.', 'tags': ['IA'],
            'content': '<ol><li>' + 'palavra ' * words + '</li></ol><p><a href="https://www.youtube.com/watch?v=CvBU1nv7W7w">Vídeo</a></p>'}


def scheduled(when='2030-01-01T12:00:00Z'):
    return {**video('private'), 'publishAt': when, 'channelId': blog.CHANNEL}


class FakeSite:
    def __init__(self):
        self.posts = {}
        self.writes = []
        self.lose_create_response = False

    def __call__(self, url, method='GET', payload=None, token=None):
        parsed = urlsplit(url)
        if parsed.path == '/api/categories':
            return [{'_id': 'cat', 'slug': 'inteligencia-artificial'}]
        if parsed.path == '/api/auth/login':
            return {'token': 'test'}
        if parsed.path.startswith('/api/posts/'):
            post = self.posts.get(parsed.path.split('/')[-1])
            if post and post['status'] == 'published':
                return dict(post)
            raise RuntimeError('Blog HTTP 404: GET ' + url)
        assert token == 'test'
        if method == 'GET':
            slug = parse_qs(parsed.query)['slug'][0]
            return [dict(self.posts[slug])] if slug in self.posts else []
        self.writes.append((method, dict(payload)))
        if method == 'POST':
            if payload['slug'] in self.posts:
                raise RuntimeError('Duplicate slug')
            post = {'_id': 'post-' + str(len(self.posts)), **payload}
            self.posts[payload['slug']] = post
            if self.lose_create_response:
                self.lose_create_response = False
                raise RuntimeError('Response lost after successful create')
            return dict(post)
        post_id = parse_qs(parsed.query)['id'][0]
        post = next(post for post in self.posts.values() if post['_id'] == post_id)
        post.update(payload)
        return dict(post)


class BlogTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.out = patch.object(blog, 'OUT', Path(self.tmp.name))
        self.out.start()
        self.root = patch.object(blog, 'ROOT', Path(self.tmp.name))
        self.root.start()
        self.db = blog.connect()
        self.config = {'start_at': '2026-11-18T20:12:00Z', 'blog_url': 'https://blog.example',
                       'blog_email': 'test@example.org', 'blog_password': 'test', 'category_id': 'cat'}

    def tearDown(self):
        self.db.close()
        self.out.stop()
        self.root.stop()
        self.tmp.cleanup()

    def scan(self, v):
        with patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'items': [v], 'checkedAt': blog.datetime.now(blog.timezone.utc).isoformat()}):
            blog.scan(self.db, self.config)

    def test_private_then_public_queues_once(self):
        self.scan(video('private'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM jobs').fetchone()[0], 0)
        self.scan(video())
        self.scan(video())
        self.assertEqual(self.db.execute('SELECT count(*) FROM jobs').fetchone()[0], 1)

    def test_old_public_baseline_not_backfilled_but_transition_is(self):
        self.scan(video(published='2026-10-01T00:00:00Z'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM jobs').fetchone()[0], 0)
        self.scan(video('unlisted', '2026-10-01T00:00:00Z'))
        self.scan(video(published='2026-10-01T00:00:00Z'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM jobs').fetchone()[0], 1)

    def test_word_floor_counts_visible_text_only(self):
        self.assertGreaterEqual(blog.validate(article(), video()['id']), 500)
        with self.assertRaisesRegex(ValueError, '500 palavras'):
            blog.validate(article(498), video()['id'])

    def test_reject_unsafe_html_and_missing_video_link(self):
        for content in ('<script>alert(1)</script>', '<p onclick="x()">oi</p>', '<a href="javascript:x()">x</a>'):
            a = article(); a['content'] += content
            with self.assertRaises(ValueError):
                blog.validate(a, video()['id'])
        with self.assertRaisesRegex(ValueError, 'link do vídeo'):
            blog.validate(article(), 'otherVideo')

    def test_lost_post_response_recovers_without_second_post(self):
        existing = {**article(), 'status': 'published'}
        with patch.object(blog, 'find_post', return_value=existing), patch.object(blog, 'request_json') as request:
            url = blog.publish(video(), article(), self.config)
        self.assertIn('/blog/youtube-', url)
        request.assert_not_called()

    def test_separate_api_host_preserves_public_blog_link(self):
        self.config['blog_api_url'] = 'https://api.blog.example'
        with patch.object(blog, 'find_post', return_value={**article(), 'status': 'published'}) as find:
            url = blog.publish(video(), article(), self.config)
        self.assertTrue(url.startswith('https://blog.example/blog/'))
        self.assertEqual(find.call_args.args[0], 'https://api.blog.example')

    def test_private_video_blocks_post_after_generation(self):
        site = FakeSite()
        with patch.object(blog, 'request_json', side_effect=site), \
             patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'privacyStatus': 'private'}):
            with self.assertRaisesRegex(ValueError, 'não está público nem agendado'):
                blog.publish(video(), article(), self.config)
        self.assertEqual(site.writes, [])

    def test_new_publication_sets_rod_byline_and_embed_metadata(self):
        site = FakeSite()
        with patch.object(blog, 'request_json', side_effect=site), \
             patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'privacyStatus': 'public'}):
            blog.publish(video(), article(), self.config)
        payload = site.writes[0][1]
        self.assertEqual(payload['author'], 'Rod Zandonadi')
        self.assertEqual(payload['youtubeVideoId'], video()['id'])

    def run_work(self, remote, site):
        with patch.object(blog, 'youtube', return_value=remote), \
             patch.object(blog, 'request_json', side_effect=site), \
             patch.object(blog, 'prepare', return_value=article()) as prepare:
            blog.work(self.db, self.config)
            return prepare.call_count

    def test_private_schedule_prepares_early_then_releases_without_regeneration(self):
        site = FakeSite()
        self.scan(scheduled())
        self.assertEqual(self.run_work(scheduled(), site), 1)
        row = self.db.execute('SELECT * FROM jobs').fetchone()
        self.assertEqual(row['status'], 'scheduled')
        post = next(iter(site.posts.values()))
        self.assertEqual(post['status'], 'scheduled')
        self.assertEqual(post['publishAt'], scheduled()['publishAt'])
        self.assertEqual(post['youtubeVideoId'], video()['id'])
        self.assertEqual(row['article_url'], blog.article_url(video()['id'], self.config))
        with self.assertRaisesRegex(RuntimeError, '404'):
            site('https://blog.example/api/posts/' + post['slug'])
        public = {**video(), 'channelId': blog.CHANNEL}
        self.scan(public)
        self.assertEqual(self.run_work(public, site), 0)
        self.assertEqual(post['status'], 'published')
        self.assertEqual(self.db.execute('SELECT status FROM jobs').fetchone()[0], 'published')
        self.assertEqual([method for method, _ in site.writes], ['POST', 'PUT'])

    def test_reschedule_preserves_url_and_human_edits_and_cancellation_hides_it(self):
        site = FakeSite()
        self.scan(scheduled())
        self.run_work(scheduled(), site)
        post = next(iter(site.posts.values()))
        post['content'] += '<p>Edição humana preservada.</p>'
        edited_content, slug = post['content'], post['slug']
        changed = scheduled('2030-01-02T12:00:00Z')
        self.scan(changed)
        self.assertEqual(self.run_work(changed, site), 0)
        self.assertEqual(post['publishAt'], changed['publishAt'])
        self.assertEqual(post['content'], edited_content)
        self.assertEqual(post['slug'], slug)
        cancelled = {**video('private'), 'channelId': blog.CHANNEL}
        self.scan(cancelled)
        self.run_work(cancelled, site)
        self.assertEqual(post['status'], 'draft')
        self.assertIsNone(post['publishAt'])
        self.assertEqual(self.db.execute('SELECT status FROM jobs').fetchone()[0], 'waiting')
        self.scan(changed)
        self.assertEqual(self.run_work(changed, site), 0)
        self.assertEqual(post['status'], 'scheduled')
        self.assertEqual(post['content'], edited_content)

    def test_lost_scheduled_post_response_does_not_create_duplicate(self):
        site = FakeSite()
        site.lose_create_response = True
        self.scan(scheduled())
        self.run_work(scheduled(), site)
        self.assertEqual(self.db.execute('SELECT status FROM jobs').fetchone()[0], 'retry')
        self.db.execute('UPDATE jobs SET next_attempt=0')
        self.db.commit()
        self.run_work(scheduled(), site)
        self.assertEqual(len(site.posts), 1)
        self.assertEqual(len(site.writes), 1)
        self.assertEqual(self.db.execute('SELECT status FROM jobs').fetchone()[0], 'scheduled')

    def test_ready_schedule_uses_recent_scan_without_extra_youtube_or_ai_calls(self):
        site = FakeSite()
        self.scan(scheduled())
        self.run_work(scheduled(), site)
        with patch.object(blog, 'youtube') as youtube, patch.object(blog, 'prepare') as prepare:
            blog.work(self.db, self.config)
        youtube.assert_not_called()
        prepare.assert_not_called()

    def test_changed_schedule_wakes_retry_without_waiting_for_backoff(self):
        self.scan(scheduled())
        self.db.execute("UPDATE jobs SET status='retry', next_attempt=99999999999")
        self.db.commit()
        self.scan(scheduled('2030-01-02T12:00:00Z'))
        self.assertEqual(self.db.execute('SELECT next_attempt FROM jobs').fetchone()[0], 0)

    def test_support_requires_steps_and_original_resource_links(self):
        v = {**video(), 'description': 'Download: https://docs.example/setup'}
        with self.assertRaisesRegex(ValueError, 'Link do vídeo ausente'):
            blog.validate_support(article(), v)
        a = article()
        a['content'] += '<p><a href="https://docs.example/setup">Instalação</a></p>'
        blog.validate_support(a, v)
        a['content'] = a['content'].replace('<ol><li>', '<p>').replace('</li></ol>', '</p>')
        with self.assertRaisesRegex(ValueError, 'passo a passo'):
            blog.validate_support(a, v)

    def test_failed_generation_remains_retryable(self):
        self.scan(video())
        with patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'privacyStatus': 'public'}), \
             patch.object(blog, 'prepare', side_effect=RuntimeError('test failure')):
            blog.work(self.db, self.config)
        row = self.db.execute('SELECT * FROM jobs').fetchone()
        self.assertEqual(row['status'], 'retry')
        self.assertEqual(row['attempts'], 1)
        self.assertGreater(row['next_attempt'], 0)

    def test_exact_upload_path_resolves_own_script(self):
        root = Path(self.tmp.name)
        source = root / 'public/phanterai/episodes/long-videos/episode/roteiro.json'
        source.parent.mkdir(parents=True)
        source.write_text('{}')
        v = {**video(), 'videoPath': str(root / 'out/phanterai/long-videos/episode/video.mp4')}
        with patch.object(blog, 'ROOT', root):
            self.assertEqual(blog.script_for(v), source)


if __name__ == '__main__':
    unittest.main()
