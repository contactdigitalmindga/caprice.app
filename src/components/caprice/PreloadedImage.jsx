import React from 'react';
export default function PreloadedImage({ src, alt = '', loading = 'eager', ...props }) {
  return <img src={src} alt={alt} loading={loading} {...props} />;
}