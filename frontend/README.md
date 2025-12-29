# TrainingAPI Frontend - E-Commerce UI/UX

Frontend hiện đại cho ứng dụng e-commerce TrainingAPI được xây dựng với React + Vite và Tailwind CSS.

## Tính năng

- 🛍️ **Trang chủ**: Hero section, danh mục sản phẩm, sản phẩm nổi bật
- 📦 **Sản phẩm**: Xem danh sách, tìm kiếm, lọc theo danh mục, phân trang
- 🛒 **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- 🔐 **Xác thực**: Đăng nhập, đăng ký với JWT cookies
- 💳 **Thanh toán**: Tạo địa chỉ giao hàng, đặt hàng
- 👤 **Hồ sơ**: Quản lý thông tin cá nhân và địa chỉ
- 🎛️ **Admin Dashboard**: Quản lý sản phẩm và danh mục (chỉ dành cho admin)

## Công nghệ sử dụng

- **React 18**: UI framework
- **Vite**: Build tool và dev server
- **React Router**: Điều hướng
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Lucide React**: Icons
- **Context API**: State management

## Cài đặt và chạy

### Yêu cầu

- Node.js 16+ và npm/yarn
- Backend TrainingAPI đang chạy trên `http://localhost:8080`

### Cài đặt dependencies

```bash
cd frontend
npm install
```

### Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

Files sẽ được build vào thư mục `dist/`

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/      # Các components tái sử dụng
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # Context API cho state management
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/          # Các trang chính
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Checkout.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Component chính
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Integration

Frontend tích hợp với các API endpoints sau:

- **Auth**: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`, `/api/auth/user`
- **Products**: `/api/public/products`, `/api/admin/products`
- **Categories**: `/api/public/categories`, `/api/admin/categories`
- **Cart**: `/api/carts`, `/api/cart/products/{id}/quantity/{op}`
- **Address**: `/api/addresses`, `/api/user/addresses`
- **Orders**: `/api/order/user/payments/{method}`

## Tính năng UI/UX

- ✅ Responsive design cho mobile, tablet và desktop
- ✅ Dark/Light mode ready (có thể mở rộng)
- ✅ Loading states và error handling
- ✅ Form validation
- ✅ Toast notifications (có thể thêm thư viện)
- ✅ Smooth transitions và animations
- ✅ Accessible components
- ✅ SEO friendly structure

## Lưu ý

- Backend phải được cấu hình để cho phép CORS từ `http://localhost:5173`
- JWT tokens được lưu trong cookies, đảm bảo `withCredentials: true` trong Axios
- Để test admin features, cần đăng ký tài khoản với role "admin"

## Tác giả

TrainingAPI Frontend Team

