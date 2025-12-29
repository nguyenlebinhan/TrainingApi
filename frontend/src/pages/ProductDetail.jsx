import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Since there's no single product endpoint, we'll search by ID
      // This is a workaround - ideally backend should have GET /products/{id}
      const response = await productsAPI.getAll({ pageNumber: 0, pageSize: 1000 });
      const found = response.data.content?.find(p => p.productId === parseInt(id));
      if (found) {
        setProduct(found);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    setAdding(true);
    const result = await addToCart(product.productId, quantity);
    if (result.success) {
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert(result.error || 'Không thể thêm vào giỏ hàng');
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card p-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={`http://localhost:8080/${product.image}`}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="h-32 w-32" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.productName}</h1>
          <div className="text-3xl font-bold text-primary-600 mb-6">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Số lượng</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

