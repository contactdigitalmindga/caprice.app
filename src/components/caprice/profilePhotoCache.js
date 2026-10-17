import { base44 } from '@/api/base44Client';
import preloadImages from '@/components/caprice/preloadImages';

const photos = new Map();
const pending = new Map();
export function cachedProfilePhoto(fileUri) {
  if (!fileUri) return null;
  const entry = photos.get(fileUri);
  return entry && entry.expires > Date.now() ? entry.url : null;
}
export function preloadProfilePhoto(fileUri) {
  if (!fileUri) return Promise.resolve(null);
  const cached = cachedProfilePhoto(fileUri);
  if (cached) return Promise.resolve(cached);
  if (pending.has(fileUri)) return pending.get(fileUri);
  const request = (async () => {
    const publicPhoto = /^https?:\/\//.test(fileUri);
    const url = publicPhoto ? fileUri : (await base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 3600 })).signed_url;
    await preloadImages([url]);
    photos.set(fileUri, { url, expires: publicPhoto ? Infinity : Date.now() + 50 * 60 * 1000 });
    return url;
  })().finally(() => pending.delete(fileUri));
  pending.set(fileUri, request);
  return request;
}