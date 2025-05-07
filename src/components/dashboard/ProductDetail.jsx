import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductImage from './ProductImage';
import BarcodeImage from './BarcodeImage';

const detailStyle = {
  maxWidth: 600,
  margin: '40px auto',
  background: '#222b3a',
  padding: 32,
  borderRadius: 12,
  color: '#f5f6fa',
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:9090/api/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setError('Erreur lors du chargement du produit'));
  }, [id]);

  if (error) return <div style={detailStyle}>{error}</div>;
  if (!product) return <div style={detailStyle}>Chargement...</div>;

  return (
    <div style={detailStyle}>
      <h2>Détail du produit</h2>
      <div style={{ marginBottom: 24 }}>
        <ProductImage productId={product.id} alt={product.name} />
      </div>
      {product.barcode && (
        <div style={{ marginBottom: 24 }}>
          <BarcodeImage barcode={product.barcode} />
        </div>
      )}
      <div><strong>Nom :</strong> {product.name}</div>
      <div><strong>Description :</strong> {product.description}</div>
      <div><strong>Prix :</strong> {product.price}</div>
      <div><strong>Stock :</strong> {product.stock}</div>
      <div><strong>Bar Code :</strong> {product.barcode || product.codeBarre}</div>
      <div><strong>Catégorie :</strong> {product.categoryId}</div>
      <div><strong>Taxe :</strong> {product.taxId}</div>
      <div><strong>Fournisseur :</strong> {product.supplierId}</div>
      <div><strong>Visible :</strong> {product.isVisible ? 'Oui' : 'Non'}</div>
    </div>
  );
};

export default ProductDetail; 