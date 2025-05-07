import React, { useEffect, useState } from 'react';

const BarcodeImage = ({ barcode }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    if (!barcode) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:9090/api/products/barcode/${barcode}/image`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.blob())
      .then(blob => setImgUrl(URL.createObjectURL(blob)))
      .catch(() => setImgUrl(null));
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [barcode]);

  if (!imgUrl) return <span style={{ color: '#ccc' }}>No barcode image</span>;
  return (
    <img
      src={imgUrl}
      alt="Barcode"
      style={{ width: 180, height: 60, objectFit: 'contain', background: '#fff', borderRadius: 6 }}
    />
  );
};

export default BarcodeImage; 