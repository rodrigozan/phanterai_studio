"""Offline behavioral checks: public transitions, retries, word floor and lost POST responses."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('blog', Path(__file__).with_name('blog-youtube.py'))
blog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blog)


def video(privacy='public', published='2026-11-18T20:16:00Z'):
    return {'id': 'CvBU1nv7W7w', 'title': 'Tutorial de IA', 'privacyStatus': privacy,
            'publishedAt': published, 'description': '', 'videoPath': ''}


def article(words=510):
    return {'title': 'Tutorial', 'excerpt': 'Aprenda com o vídeo.', 'tags': ['IA'],
            'content': '<p>' + 'palavra ' * words + '</p><p><a href="https://www.youtube.com/watch?v=CvBU1nv7W7w">Vídeo</a></p>'}


class BlogTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.out = patch.object(blog, 'OUT', Path(self.tmp.name))
        self.out.start()
        self.db = blog.connect()
        self.config = {'start_at': '2026-11-18T20:12:00Z', 'blog_url': 'https://blog.example',
                       'blog_email': 'test@example.org', 'blog_password': 'test', 'category_id': 'cat'}

    def tearDown(self):
        self.db.close()
        self.out.stop()
        self.tmp.cleanup()

    def scan(self, v):
        with patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'items': [v], 'checkedAt': 'now'}):
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
        with patch.object(blog, 'find_post', return_value=None), \
             patch.object(blog, 'request_json', side_effect=[[], {'token': 'test'}]) as request, \
             patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'privacyStatus': 'private'}):
            with self.assertRaisesRegex(ValueError, 'deixou de ser público'):
                blog.publish(video(), article(), self.config)
        self.assertFalse(any(c.args[0].endswith('/api/admin/posts') for c in request.call_args_list))

    def test_new_publication_sets_rod_byline_and_embed_metadata(self):
        existing = {**article(), 'status': 'published'}
        with patch.object(blog, 'find_post', side_effect=[None, existing]), \
             patch.object(blog, 'request_json', side_effect=[[], {'token': 'test'}, {}]) as request, \
             patch.object(blog, 'youtube', return_value={'channelId': blog.CHANNEL, 'privacyStatus': 'public'}):
            blog.publish(video(), article(), self.config)
        payload = request.call_args_list[-1].args[2]
        self.assertEqual(payload['author'], 'Rod Zandonadi')
        self.assertEqual(payload['youtubeVideoId'], video()['id'])

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
