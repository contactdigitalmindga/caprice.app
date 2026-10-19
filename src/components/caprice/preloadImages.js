const loaded = new Set();
const pending = new Map();
const load = src => {
  if (loaded.has(src)) return Promise.resolve();
  if (pending.has(src)) return pending.get(src);
  const promise = new Promise(resolve => {
    const image = new window.Image();
    const finish = success => {
      clearTimeout(timer);
      image.onload = image.onerror = null;
      if (success) loaded.add(src);
      resolve();
    };
    const timer = setTimeout(() => finish(false), 8000);
    image.onload = async () => { await image.decode().catch(() => {}); finish(true); };
    image.onerror = () => finish(false);
    image.src = src;
  });
  pending.set(src, promise);
  promise.then(() => pending.delete(src));
  return promise;
};
export default async function preloadImages(sources, onProgress = () => {}) {
  const urls = [...new Set(sources.filter(Boolean))];
  let cursor = 0, complete = 0;
  onProgress(0);
  await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
    while (cursor < urls.length) {
      await load(urls[cursor++]);
      onProgress(Math.round(++complete / urls.length * 100));
    }
  }));
  onProgress(100);
}