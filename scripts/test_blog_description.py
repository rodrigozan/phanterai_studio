"""Verify the article must be ready before updating YouTube; retry independently."""
import json
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch
from test_blog_youtube import blog, article, video


class DescriptionHandoff(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.out = Path(self.temp.name)
        self.patcher = patch.object(blog, 'OUT', self.out)
        self.patcher.start()
        self.db = blog.connect()
        self.config = {'blog_url': 'https://phanterai.com', 'link_descriptions_enabled': True,
                       'blog_email': 'test', 'blog_password': 'test'}
        self.video = video()
        blog.queue_video(self.db, self.video, self.config)
        self.db.execute("UPDATE jobs SET status='published', post_id='post'")
        self.db.commit()
        self.url = blog.article_url(self.video['id'], self.config)
        self.post = {**article(), 'status': 'published', 'youtubeVideoId': self.video['id']}

    def tearDown(self):
        self.db.close()
        self.patcher.stop()
        self.temp.cleanup()

    def test_unready_or_wrong_video_never_mutates_youtube(self):
        for override in ({'status': 'draft'}, {'youtubeVideoId': 'abcdefghijk'}):
            with patch.object(blog, 'find_post', return_value={**self.post, **override}), patch.object(blog.subprocess, 'run') as run:
                blog.link_descriptions(self.db, self.config, self.video['id'])
                run.assert_not_called()

    def test_failure_preserves_published_job_and_retries_later(self):
        with patch.object(blog, 'find_post', return_value=self.post), patch.object(blog.subprocess, 'run', side_effect=RuntimeError('offline')) as run:
            blog.link_descriptions(self.db, self.config)
            blog.link_descriptions(self.db, self.config)
            self.assertEqual(run.call_count, 1)
        self.assertEqual(self.db.execute('SELECT status FROM jobs').fetchone()['status'], 'published')

    def test_verified_receipt_is_idempotent_and_removal_triggers_repair(self):
        proof = {'video_id': self.video['id'], 'url': self.url, 'verified': True,
                 'checked_at': '2026-01-01T00:00:00Z'}
        with patch.object(blog, 'find_post', return_value=self.post), patch.object(blog, 'script_for', side_effect=ValueError()), patch.object(blog.subprocess, 'run', return_value=SimpleNamespace(returncode=0, stdout=json.dumps(proof))) as run:
            blog.link_descriptions(self.db, self.config)
            blog.link_descriptions(self.db, self.config)
            self.assertEqual(run.call_count, 1)
            blog.atomic_json(self.out / 'videos.json', {'checkedAt': '2026-01-02T00:00:00Z', 'items': [self.video]})
            blog.link_descriptions(self.db, self.config)
            self.assertEqual(run.call_count, 2)
        saved = json.loads((self.out / self.video['id'] / 'publication.json').read_text())
        self.assertTrue(saved['description_linked'])


if __name__ == '__main__':
    unittest.main()
