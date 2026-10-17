import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Resolves a private file_uri (from UploadPrivateFile) into a temporary
// displayable URL. Public http(s) URLs pass through unchanged.
export function useSignedPhoto(fileUri) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!fileUri) { setUrl(null); return; }
    if (/^https?:\/\//.test(fileUri)) { setUrl(fileUri); return; }
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 86400 })
      .then(r => { if (alive) setUrl(r.signed_url); })
      .catch(() => { if (alive) setUrl(null); });
    return () => { alive = false; };
  }, [fileUri]);
  return url;
}