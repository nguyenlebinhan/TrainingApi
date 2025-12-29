import React, { useState, useEffect } from 'react';
import { User, MapPin, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addressAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getUserAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Thông tin</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Địa chỉ</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Đơn hàng</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Thông tin tài khoản</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Địa chỉ của tôi</h2>
              {addresses.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có địa chỉ nào</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.addressId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-semibold">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.state}, {address.zipCode}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>
              <p className="text-gray-500">Chức năng này sẽ được cập nhật sau</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

