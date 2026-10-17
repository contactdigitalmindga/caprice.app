import { useState, useEffect } from 'react';
import { cachedProfilePhoto, preloadProfilePhoto } from '@/components/caprice/profilePhotoCache';

export function useSignedPhoto(fileUri) {
  const [photo, setPhoto] = useState(() => ({ fileUri, url: cachedProfilePhoto(fileUri) }));
  useEffect(() => {
    let alive = true;
    const resolvePhoto = () => preloadProfilePhoto(fileUri)
      .then(url => { if (alive) setPhoto({ fileUri, url }); })
      .catch(() => { if (alive) setPhoto({ fileUri, url: null }); });
    resolvePhoto();
    const renewal = setInterval(resolvePhoto, 50 * 60 * 1000);
    return () => { alive = false; clearInterval(renewal); };
  }, [fileUri]);
  return photo.fileUri === fileUri ? photo.url : cachedProfilePhoto(fileUri);
}