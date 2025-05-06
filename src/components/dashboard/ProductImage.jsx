import React, { useEffect, useState } from 'react';

const ProductImage = ({ productId, alt }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      setImgUrl(null);
      return;
    }
    fetch(`http://localhost:9090/api/products/image/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Image fetch failed');
        return res.blob();
      })
      .then(blob => {
        if (isMounted) setImgUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (isMounted) setImgUrl(null);
      });
    return () => {
      isMounted = false;
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [productId]);

  if (!imgUrl) return <span style={{ color: '#ccc' }}>No image</span>;
  return (
    <img
      src={imgUrl}
      alt={alt}
      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, background: '#fff' }}
    />
  );
};

export default ProductImage; 