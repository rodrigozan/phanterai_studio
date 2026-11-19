const {test} = require('node:test');
const assert = require('node:assert/strict');
const {buildDescription, hasLink} = require('./blog-youtube-description.cjs');
const id = 'CvBU1nv7W7w', url = 'https://phanterai.com/blog/youtube-cvbu1nv7w7w';
test('preserves description, chapters and links; adds article once', () => {
  const before = '00:00 Introdução\nComando: npm install\nFonte: https://example.org\n#IA';
  const after = buildDescription(before, id, url);
  assert.ok(after.endsWith(before));
  assert.equal(buildDescription(after, id, url), after);
});
test('accepts existing URL with tracking, rejects substring matches', () => {
  const before = `Artigo: ${url}?utm_source=youtube`;
  assert.equal(buildDescription(before, id, url), before);
  assert.equal(hasLink(url + '-outro', url), false);
});
test('repairs only managed header, preserves recommendations', () => {
  const before = 'Passo a passo e links deste vídeo:\nhttps://phanterai.com/blog/youtube-abcdefghijk\n\nRecomendação: https://phanterai.com/blog/youtube-outrovideo1';
  const after = buildDescription(before, id, url);
  assert.ok(!after.includes('abcdefghijk'));
  assert.ok(after.includes('Recomendação: https://phanterai.com/blog/youtube-outrovideo1'));
});
test('rejects wrong article and overflow without truncating', () => {
  assert.throws(() => buildDescription('', id, url.replace('phanterai.com', 'evil.example')));
  assert.throws(() => buildDescription('', 'abcdefghijk', url));
  assert.throws(() => buildDescription('x'.repeat(5000), id, url));
});
