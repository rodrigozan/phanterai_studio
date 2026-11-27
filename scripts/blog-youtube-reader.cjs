// Read-only YouTube adapter: reuses the connected channel; never changes videos.
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PHANTERTOOLS_ROOT || '/root/phantertools/phantertools_api';
const {config, youtubeProfile} = require(path.join(base, 'dist/config.js'));
const mongoose = require(path.join(base, 'node_modules/mongoose'));
const {OAuth2Client} = require(path.join(base, 'node_modules/google-auth-library'));
const {youtube} = require(path.join(base, 'node_modules/@googleapis/youtube'));
const {YoutubeChannel} = require(path.join(base, 'dist/models/YoutubeChannel.js'));
const {YoutubeVideo} = require(path.join(base, 'dist/models/YoutubeVideo.js'));
const {decrypt} = require(path.join(base, 'dist/lib/crypto.js'));
const {spendQuota} = require(path.join(base, 'dist/services/youtube/quota.js'));

async function main() {
  const channelId = process.env.BLOG_CHANNEL_ID || 'UCYHsuiYTaYCV_bfuyvW86Kw';
  const cacheFile = process.argv[2];
  if (!cacheFile) throw new Error('Pass a private cache file path');
  await mongoose.connect(config.dbUri, {serverSelectionTimeoutMS: 10000});
  const channel = await YoutubeChannel.findOne({channelId, disconnectedAt: {$exists: false}});
  if (!channel?.refreshTokenEnc || channel.status === 'revoked') throw new Error('YouTube channel unavailable');
  const profile = youtubeProfile(channel.credential);
  const auth = new OAuth2Client(profile.clientId, profile.clientSecret, profile.redirectUri);
  auth.setCredentials({refresh_token: decrypt(channel.refreshTokenEnc)});
  const api = youtube({version: 'v3', auth});
  const read = async (fn) => {
    const result = await fn();
    await spendQuota(1, {profile: channel.credential});
    return result.data;
  };
  if (process.argv[3]) {
    const data = await read(() => api.videos.list({id: [process.argv[3]], part: ['snippet', 'status']}));
    const v = data.items?.[0];
    process.stdout.write(JSON.stringify({id: v?.id, channelId: v?.snippet?.channelId,
      title: v?.snippet?.title, description: v?.snippet?.description,
      publishedAt: v?.snippet?.publishedAt, publishAt: v?.status?.publishAt || null,
      privacyStatus: v?.status?.privacyStatus, uploadStatus: v?.status?.uploadStatus}));
    return;
  }
  let cache = {ids: [], scannedAt: 0};
  if (fs.existsSync(cacheFile)) cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  if (cache.channelId && cache.channelId !== channelId) throw new Error('Cache belongs to another channel');
  if (!cache.playlistId) {
    const data = await read(() => api.channels.list({id: [channelId], part: ['contentDetails']}));
    cache.playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!cache.playlistId) throw new Error('Uploads playlist not found');
  }
  const ids = new Set(cache.ids);
  const fullScan = Date.now() - cache.scannedAt > 3600000;
  let pageToken;
  const recentIds = new Set();
  do {
    const page = await read(() => api.playlistItems.list({playlistId: cache.playlistId,
      part: ['contentDetails'], maxResults: fullScan ? 50 : 20, pageToken}));
    for (const item of page.items || []) if (item.contentDetails?.videoId) {
      ids.add(item.contentDetails.videoId);
      recentIds.add(item.contentDetails.videoId);
    }
    pageToken = fullScan ? page.nextPageToken : undefined;
  } while (pageToken);
  const local = await YoutubeVideo.find({channelId, youtubeVideoId: {$type: 'string'}})
    .select('youtubeVideoId videoPath').lean();
  const paths = new Map(local.map(v => [v.youtubeVideoId, v.videoPath]));
  for (const v of local) ids.add(v.youtubeVideoId);
  const allIds = [...ids], items = [];
  const states = cache.states || {};
  // Keep watching every known private/unlisted video, including old scheduled uploads.
  // Established public videos outside the latest 20 are reconciled hourly to save quota.
  const watchedIds = fullScan ? allIds : allIds.filter(id => recentIds.has(id) || states[id] !== 'public');
  for (let i = 0; i < watchedIds.length; i += 50) {
    const data = await read(() => api.videos.list({id: watchedIds.slice(i, i + 50), part: ['snippet', 'status']}));
    for (const v of data.items || []) {
      if (v.snippet?.channelId !== channelId) continue;
      states[v.id] = v.status?.privacyStatus;
      items.push({id: v.id, channelId, title: v.snippet.title, description: v.snippet.description,
        publishedAt: v.snippet.publishedAt, privacyStatus: v.status?.privacyStatus,
        publishAt: v.status?.publishAt || null,
        uploadStatus: v.status?.uploadStatus, videoPath: paths.get(v.id) || null});
    }
  }
  const next = {channelId, playlistId: cache.playlistId, ids: allIds, states,
    scannedAt: fullScan ? Date.now() : cache.scannedAt};
  fs.writeFileSync(cacheFile + '.tmp', JSON.stringify(next), {mode: 0o600});
  fs.renameSync(cacheFile + '.tmp', cacheFile);
  process.stdout.write(JSON.stringify({channelId, checkedAt: new Date().toISOString(), items}));
}
main().catch(e => { console.error('YouTube read failed:', e.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
