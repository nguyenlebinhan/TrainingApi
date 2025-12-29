import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    setAdding(true);
    const result = await addToCart(product.productId, 1);
    if (result.success) {
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert(result.error || 'Không thể thêm vào giỏ hàng');
    }
    setAdding(false);
  };

  return (
    <Link to={`/products/${product.productId}`} className="card p-4 block hover:scale-105 transition-transform">
      <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
        {product.image ? (
          <img
            src={`http://localhost:8080/${product.image}`}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="h-16 w-16" />
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.productName}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-600">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(product.price)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

