import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Tag } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    description: '',
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchCategories();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ pageNumber: 0, pageSize: 100 });
      setProducts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll({ pageNumber: 0, pageSize: 100 });
      setCategories(response.data.content || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.create(productForm.categoryId, {
        productName: productForm.productName,
        description: productForm.description,
        price: parseFloat(productForm.price),
      });
      alert('Tạo sản phẩm thành công!');
      setShowProductModal(false);
      setProductForm({ productName: '', description: '', price: '', categoryId: '' });
      fetchProducts();
    } catch (error) {
      alert('Tạo sản phẩm thất bại');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.update(editingProduct.productId, {
        productName: productForm.productName,
        description: productForm.description,
        price: parseFloat(productForm.price),
      });
      alert('Cập nhật sản phẩm thành công!');
      setShowProductModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert('Cập nhật sản phẩm thất bại');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productsAPI.delete(productId);
        alert('Xóa sản phẩm thành công!');
        fetchProducts();
      } catch (error) {
        alert('Xóa sản phẩm thất bại');
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.create(categoryForm);
      alert('Tạo danh mục thành công!');
      setShowCategoryModal(false);
      setCategoryForm({ categoryName: '', description: '' });
      fetchCategories();
    } catch (error) {
      alert('Tạo danh mục thất bại');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.update(editingCategory.categoryId, categoryForm);
      alert('Cập nhật danh mục thành công!');
      setShowCategoryModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      alert('Cập nhật danh mục thất bại');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoriesAPI.delete(categoryId);
        alert('Xóa danh mục thành công!');
        fetchCategories();
      } catch (error) {
        alert('Xóa danh mục thất bại');
      }
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      productName: product.productName,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.category?.categoryId || '',
    });
    setShowProductModal(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      categoryName: category.categoryName,
      description: category.description || '',
    });
    setShowCategoryModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bảng điều khiển Admin</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Sản phẩm</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Danh mục</span>
          </div>
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ productName: '', description: '', price: '', categoryId: '' });
                setShowProductModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.productId} className="card p-4">
                  {product.image && (
                    <img
                      src={`http://localhost:8080/${product.image}`}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold text-primary-600 mb-4">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditProduct(product)}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ categoryName: '', description: '' });
                setShowCategoryModal(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm danh mục</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.categoryId} className="card p-6">
                  <h3 className="font-semibold text-xl mb-2">{category.categoryName}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditCategory(category)}
                      className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.categoryId)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={productForm.productName}
                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                {!editingProduct && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="flex-1 btn-primary">
                  {editingProduct ? 'Cập nhật' : 'Tạo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
            </h2>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                  <input
                    type="text"
                    value={categoryForm.categoryName}
                    onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="flex-1 btn-primary">
                  {editingCategory ? 'Cập nhật' : 'Tạo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

