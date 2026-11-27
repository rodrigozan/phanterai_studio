// Verified description handoff. Imports production credentials only when executed.
const HEADER = 'Passo a passo e links deste vídeo:';
function hasLink(description, target) {
  const expected = new URL(target);
  return (description.match(/https:\/\/[^\s<>"']+/g) || []).some(raw => {
    try { const url = new URL(raw.replace(/[).,;!]+$/, '')); return url.origin === expected.origin && url.pathname === expected.pathname; }
    catch { return false; }
  });
}
function buildDescription(description, videoId, articleUrl) {
  const url = new URL(articleUrl);
  // Slug amigável (qualquer /blog/<palavras-com-hifen>) ou o antigo, que só vale para o próprio vídeo.
  const slug = url.pathname.replace(/^\/blog\//, '');
  const slugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && url.pathname.startsWith('/blog/') &&
    (!slug.startsWith('youtube-') || slug === 'youtube-' + videoId.toLowerCase());
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId) || url.origin !== 'https://phanterai.com' || !slugOk || url.search || url.hash)
    throw new Error('Artigo não corresponde ao vídeo/domínio PhanterAI');
  if (hasLink(description, articleUrl)) return description;
  const original = description.replace(/^Passo a passo e links deste vídeo:\r?\nhttps:\/\/phanterai\.com\/blog\/[\w-]+\r?\n\r?\n/, '');
  const result = `${HEADER}\n${articleUrl}\n\n${original}`;
  if (result.length > 5000) throw new Error('Descrição excederia 5000 caracteres; ajuste o texto sem truncar');
  return result;
}
module.exports = {buildDescription, hasLink};

async function main() {
  const fs = require('node:fs');
  const path = require('node:path');
  const base = process.env.PHANTERTOOLS_ROOT || '/root/phantertools/phantertools_api';
  const {config} = require(path.join(base, 'dist/config.js'));
  const mongoose = require(path.join(base, 'node_modules/mongoose'));
  const {YoutubeChannel} = require(path.join(base, 'dist/models/YoutubeChannel.js'));
  const {refreshToken} = require(path.join(base, 'dist/services/youtube/channels.js'));
  const {ytApi} = require(path.join(base, 'dist/services/youtube/api.js'));
  const {spendQuota} = require(path.join(base, 'dist/services/youtube/quota.js'));
  const {updateSnippet} = require(path.join(base, 'dist/services/youtube/snippet.js'));
  const [videoId, articleUrl, folder] = process.argv.slice(2);
  buildDescription('', videoId, articleUrl);
  try {
    await mongoose.connect(config.dbUri, {serverSelectionTimeoutMS: 10000});
    const channelId = process.env.BLOG_CHANNEL_ID || 'UCYHsuiYTaYCV_bfuyvW86Kw';
    const channel = await YoutubeChannel.findOne({channelId, disconnectedAt: {$exists: false}});
    if (!channel?.refreshTokenEnc || channel.status === 'revoked') throw new Error('Canal indisponível');
    const before = await ytApi.getVideo(refreshToken(channel), videoId);
    await spendQuota(1, {profile: channel.credential});
    if (before?.snippet?.channelId !== channelId) throw new Error('Vídeo pertence a outro canal');
    const description = buildDescription(before.snippet.description || '', videoId, articleUrl);
    const changed = description !== (before.snippet.description || '');
    if (changed) {
      fs.mkdirSync(folder, {recursive: true, mode: 0o700});
      fs.writeFileSync(path.join(folder, `description-before-${Date.now()}.json`), JSON.stringify(before, null, 2), {mode: 0o600});
      const result = await updateSnippet(channel, videoId, {description});
      if (!result.verified || !result.statusPreserved || !result.metadataVerified)
        throw new Error('Descrição enviada, mas confirmação incompleta');
    }
    process.stdout.write(JSON.stringify({video_id: videoId, url: articleUrl, verified: true, changed,
      checked_at: new Date().toISOString()}));
  } finally { await mongoose.disconnect(); }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
