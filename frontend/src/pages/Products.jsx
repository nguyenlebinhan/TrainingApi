import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const categoryId = searchParams.get('category');
    const keyword = searchParams.get('search');
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    }
    if (keyword) {
      setSearchKeyword(keyword);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, selectedCategory, searchKeyword]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ pageNumber: 0, pageSize: 100 });
      setCategories(response.data.content || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCategory) {
        response = await productsAPI.getByCategory(selectedCategory, {
          pageNumber,
          pageSize: 12,
        });
      } else if (searchKeyword) {
        response = await productsAPI.searchByKeyword(searchKeyword, {
          pageNumber,
          pageSize: 12,
        });
      } else {
        response = await productsAPI.getAll({
          pageNumber,
          pageSize: 12,
        });
      }
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchKeyword('');
    setPageNumber(0);
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setSearchKeyword('');
    setPageNumber(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Danh mục</h2>
            <button
              onClick={handleClearFilter}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                !selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => handleCategoryChange(category.categoryId)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                  selectedCategory === category.categoryId
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {searchKeyword && (
            <div className="mb-4">
              <p className="text-gray-600">
                Kết quả tìm kiếm cho: <span className="font-semibold">{searchKeyword}</span>
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
                    disabled={pageNumber === 0}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2">
                    Trang {pageNumber + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(Math.min(totalPages - 1, pageNumber + 1))}
                    disabled={pageNumber >= totalPages - 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;

