const loaded = new Set();
export default async function preloadImages(sources, onProgress = () => {}) {
  const urls = [...new Set(sources.filter(Boolean))];
  let cursor = 0, complete = 0;
  onProgress(0);
  const load = src => new Promise(resolve => {
    if (loaded.has(src)) return resolve();
    const image = new window.Image();
    const timer = setTimeout(() => finish(false), 20000);
    const finish = success => {
      clearTimeout(timer);
      image.onload = image.onerror = null;
      if (success) loaded.add(src);
      resolve();
    };
    image.onload = async () => { await image.decode().catch(() => {}); finish(true); };
    image.onerror = () => finish(false);
    image.src = src;
  });
  await Promise.all(Array.from({ length: Math.min(6, urls.length) }, async () => {
    while (cursor < urls.length) {
      await load(urls[cursor++]);
      onProgress(Math.round(++complete / urls.length * 100));
    }
  }));
  onProgress(100);
}