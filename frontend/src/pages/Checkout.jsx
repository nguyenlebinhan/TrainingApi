import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { addressAPI, orderAPI } from '../services/api';

const Checkout = () => {
  const { cart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Việt Nam',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getUserAddresses();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].addressId);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addressAPI.create(newAddress);
      await fetchAddresses();
      setSelectedAddress(response.data.addressId);
      setShowNewAddress(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Việt Nam',
      });
    } catch (error) {
      alert('Không thể tạo địa chỉ mới');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    try {
      await orderAPI.placeOrder(paymentMethod, {
        addressId: selectedAddress,
        pgName: paymentMethod === 'COD' ? 'COD' : 'Online',
        pgPaymentId: '',
        pgStatus: 'SUCCESS',
        pgResponseMessage: paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán thành công',
      });
      alert('Đặt hàng thành công!');
      navigate('/profile');
    } catch (error) {
      alert('Đặt hàng thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-500">Giỏ hàng trống</p>
        <button onClick={() => navigate('/cart')} className="btn-primary mt-4">
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Địa chỉ giao hàng</span>
              </h2>
              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {showNewAddress ? 'Hủy' : '+ Thêm địa chỉ mới'}
              </button>
            </div>

            {showNewAddress && (
              <form onSubmit={handleCreateAddress} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="Đường/Phố"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="input-field"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Thành phố"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Mã bưu điện"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="input-field"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Lưu địa chỉ
                </button>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((address) => (
                <label
                  key={address.addressId}
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedAddress === address.addressId
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.addressId}
                    checked={selectedAddress === address.addressId}
                    onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}, {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Phương thức thanh toán</span>
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-gray-300">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-gray-300">
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-semibold">Thanh toán trực tuyến</p>
                  <p className="text-sm text-gray-600">Thanh toán qua thẻ ngân hàng hoặc ví điện tử</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 mb-4">
              {cart.cartItems.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.productName} x {item.quantity}
                  </span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.quantity * item.product.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Tổng cộng:</span>
                <span className="text-primary-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(getTotalPrice())}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

