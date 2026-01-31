# Clothing Merchant – Full Stack E-commerce Website

## Project Overview

Clothing Merchant is a comprehensive full-stack e-commerce platform specializing in clothing products. It provides a seamless shopping experience with user authentication via OTP, secure payments through Razorpay, and efficient product management. The application features a modern React frontend with Redux for state management and a robust Node.js/Express backend integrated with MongoDB for data persistence.

## Features

- **User Authentication**: Mobile number OTP-based login and registration using Twilio
- **Product Management**: Comprehensive product listing with search, filtering, and categorization
- **Shopping Cart & Wishlist**: Add, update, and manage cart items and wishlists
- **Secure Checkout**: Integrated Razorpay payment gateway for secure transactions
- **Order Tracking**: Real-time order status updates and delivery tracking
- **User Profile**: Manage personal information, addresses, and order history
- **Admin Panel**: Product and category management for administrators
- **Media Upload**: Cloudinary integration for product image storage
- **Responsive Design**: Mobile-first UI built with Tailwind CSS

## Tech Stack

### Frontend
- **React**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling
- **Framer Motion**: Animation library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Multer**: File upload middleware

### Third-Party Services
- **Twilio**: SMS OTP service
- **Razorpay**: Payment gateway
- **Cloudinary**: Media storage and optimization

## System Architecture

### Frontend–Backend–Database Flow
```
Frontend (React/Vite) ↔ Backend (Express.js) ↔ Database (MongoDB)
     ↓                        ↓                        ↓
  User Interface        API Controllers         Data Models
  State Management      Authentication          User/Product/Order
  Routing               Business Logic          Collections
```

### Payment and OTP Service Integration
```
User Request → Backend API → Twilio/Razorpay API → Response → Frontend Update
     ↓              ↓              ↓                    ↓            ↓
  OTP Request    OTP Generation  SMS Delivery      Verification   UI Feedback
Payment Init    Order Creation  Payment Portal    Verification   Success Page
```

## Folder Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── auth.controllers.js
│   │   │   ├── category.controllers.js
│   │   │   └── product.controllers.js
│   │   └── user/
│   │       └── user.controllers.js
│   ├── db/
│   │   └── index.js
│   ├── middlewares/
│   │   ├── multer.middlewares.js
│   │   ├── roleAuth.js
│   │   ├── validateMobileNumber.middlewares.js
│   │   └── verifyJwt.js
│   ├── models/
│   │   ├── category.js
│   │   ├── order.models.js
│   │   ├── product.js
│   │   └── user.models.js
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── auth.admin.routes.js
│   │   │   ├── category.routes.js
│   │   │   └── product.routes.js
│   │   └── user/
│   │       └── user.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiRes.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── otpSend.user.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── public/
├── uploads/
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   ├── AuthLayout.jsx
│   │   ├── Button.jsx
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── container/
│   │   ├── FilterSidebar/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── Home/
│   │   ├── Input.jsx
│   │   ├── Login.jsx
│   │   ├── Logo.jsx
│   │   ├── MyOrder/
│   │   ├── PhoneInput.jsx
│   │   ├── Products/
│   │   ├── Profile/
│   │   ├── SearchBar/
│   │   └── Signup.jsx
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── ContactUs.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── MyOrders.jsx
│   ├── services/
│   │   ├── admin/
│   │   ├── auth.js
│   │   ├── order.js
│   │   ├── profile.js
│   │   ├── userCart.js
│   │   └── userProduct.js
│   ├── store/
│   │   ├── addressSlice.js
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── guestUserSlice.js
│   │   ├── orderSlice.js
│   │   ├── productSlice.js
│   │   └── store.js
│   ├── assets/
│   ├── conf/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
└── .env
```

## Environment Variables

### Backend `.env`
```env
# Database
MONGODB_URI=mongodb://localhost:27017/clothing-merchant

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server
PORT=8000
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Git

### Backend Setup Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clothing-merchant/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables

4. **Start MongoDB**
   - Ensure MongoDB is running locally or configure Atlas connection

5. **Run the backend server**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:8000`

### Frontend Setup Steps
1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Configure API base URL and Razorpay key

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## Authentication Flow

### OTP Generation & Verification (Twilio)
1. **User Registration/Login Request**
   - User enters mobile number
   - Frontend sends request to `/api/v1/auth/send-otp`

2. **OTP Generation**
   - Backend generates 6-digit OTP using `otp-generator`
   - OTP stored in database with expiration (5 minutes)
   - Twilio sends SMS to user's mobile number

3. **OTP Verification**
   - User enters received OTP
   - Frontend sends verification request to `/api/v1/auth/verify-otp`
   - Backend validates OTP and expiration
   - On success, JWT tokens are generated and returned

### JWT Lifecycle
- **Access Token**: Short-lived (15 minutes), used for API authentication
- **Refresh Token**: Long-lived (7 days), used to renew access tokens
- Tokens stored in HTTP-only cookies for security
- Automatic token refresh handled by frontend middleware

## API Documentation

### Authentication Routes

#### Send OTP
```http
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone": "+1234567890"
}
```
**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "otp": "123456"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

### Product Routes

#### Get All Products
```http
GET /api/v1/products
Authorization: Bearer <access-token>
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "T-Shirt",
      "price": "1999",
      "image": "cloudinary-url",
      "category": "Men"
    }
  ]
}
```

#### Get Product by ID
```http
GET /api/v1/products/:id
Authorization: Bearer <access-token>
```

### Cart & Wishlist Routes

#### Add to Cart
```http
POST /api/v1/cart/add
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 1,
  "size": "M",
  "color": "Blue"
}
```

#### Get Cart Items
```http
GET /api/v1/cart
Authorization: Bearer <access-token>
```

### Order & Payment Routes

#### Create Order
```http
POST /api/v1/orders/create
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "items": [...],
  "address": {...},
  "totalAmount": 2999
}
```

#### Verify Payment
```http
POST /api/v1/orders/verify-payment
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature"
}
```

## Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  gender: String (required),
  phone: String (required, unique),
  otp: [{
    otpCode: String,
    otpGeneratedTime: Date,
    otpExpirationTime: Date
  }],
  role: String (default: 'user'),
  refreshToken: String,
  address: [{
    name: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    phoneNumber: String,
    locality: String,
    landmark: String,
    addressType: String
  }],
  cart: [{
    productId: ObjectId (ref: 'product'),
    productName: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
    image: String
  }],
  wishlist: [/* Similar to cart */],
  saveForLater: [/* Similar structure */]
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String (required),
  TagId: String (required),
  CategoryName: String (required),
  CategoryTagId: String (required),
  subCategoryName: String,
  subCategoryTagId: String,
  gender: String (required),
  image: String (required),
  images: [String] (required),
  price: String (required),
  discount: String (required),
  stock: Number (required),
  ratings: Number,
  reviews: [{
    userId: ObjectId (ref: 'User'),
    comment: String,
    ratings: Number,
    date: Date
  }],
  variants: {
    size: [String],
    color: [String]
  },
  productDetails: Mixed
}
```

### Cart Model
Cart is embedded within the User model as an array of cart items.

### Order Model
```javascript
{
  userId: ObjectId (ref: 'User', required),
  items: [{
    productId: ObjectId (ref: 'Product'),
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    size: String
  }],
  address: {
    name: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    phoneNumber: String
  },
  totalPrice: Number (required),
  totalDiscount: Number,
  finalAmount: Number (required),
  paymentStatus: String (enum: ['PENDING', 'PAID', 'FAILED']),
  orderStatus: String (enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String
}
```

## Payment Flow (Razorpay)

### Order Creation
1. User initiates checkout with selected items
2. Frontend calculates total amount and sends order data to backend
3. Backend creates Razorpay order using `razorpay.orders.create()`
4. Returns order ID and amount to frontend
5. Frontend loads Razorpay checkout with order details

### Payment Verification
1. User completes payment on Razorpay portal
2. Razorpay sends payment success callback to frontend
3. Frontend sends payment verification request to backend
4. Backend verifies payment signature using Razorpay SDK
5. On successful verification, updates order status and sends confirmation

## Error Handling & API Response Format

### Standard API Response Format
```json
{
  "success": boolean,
  "message": "string",
  "data": object | array | null,
  "error": object | null
}
```

### Error Response Examples
```json
// Validation Error
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "message": "Invalid email format"
  }
}

// Authentication Error
{
  "success": false,
  "message": "Unauthorized access",
  "error": {
    "code": 401,
    "type": "AUTHENTICATION_ERROR"
  }
}
```

### Error Handling Middleware
- Centralized error handling in `ApiError.js`
- Async error wrapper in `asyncHandler.js`
- Validation errors handled by `express-validator`

## Security Best Practices

- **Password Security**: bcrypt hashing for sensitive data
- **JWT Tokens**: Secure token-based authentication with expiration
- **Input Validation**: Server-side validation using express-validator
- **CORS**: Configured for allowed origins
- **Rate Limiting**: Implemented for OTP and authentication endpoints
- **HTTPS**: Enforced in production environment
- **Environment Variables**: Sensitive data stored securely
- **File Upload Security**: Multer configuration with file type restrictions

## Usage Guide

### User Registration/Login
1. Navigate to login page
2. Enter mobile number
3. Receive OTP via SMS
4. Enter OTP to authenticate
5. Complete profile setup (name, email, etc.)

### Browsing Products
1. Use search bar to find products
2. Apply filters (category, price, size, color)
3. View product details and images
4. Read reviews and ratings

### Cart & Wishlist
1. Add products to cart with size/color selection
2. Adjust quantities in cart
3. Move items to wishlist for later
4. Save items for later from cart

### Checkout & Order Tracking
1. Review cart items and proceed to checkout
2. Select or add delivery address
3. Complete payment via Razorpay
4. Track order status in profile section

## Screenshots Section

### Homepage
![Homepage](screenshots/homepage.png)
*Main landing page with featured products and categories*

### Product Listing
![Product Listing](screenshots/product-listing.png)
*Product grid with search and filter options*

### Product Details
![Product Details](screenshots/product-details.png)
*Detailed product view with images and specifications*

### Shopping Cart
![Shopping Cart](screenshots/cart.png)
*Cart page showing selected items and totals*

### Checkout Process
![Checkout](screenshots/checkout.png)
*Secure checkout page with address and payment*

### User Profile
![User Profile](screenshots/profile.png)
*User dashboard with order history and settings*

## Deployment Guide

### Frontend Deployment (Vercel)
1. **Connect Repository**
   - Import project from GitHub to Vercel
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

2. **Environment Variables**
   - Add frontend environment variables in Vercel dashboard
   - Update API base URL to production backend URL

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Custom domain can be configured

### Backend Deployment (Render)
1. **Create Render Account**
   - Sign up at render.com

2. **Connect Repository**
   - Create new Web Service
   - Connect GitHub repository

3. **Configure Service**
   - Runtime: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables**
   - Add all backend environment variables
   - Configure MongoDB Atlas connection

5. **Database Setup**
   - Create MongoDB Atlas cluster
   - Whitelist Render IP addresses
   - Update connection string in environment variables

6. **Deploy**
   - Render deploys automatically on push
   - Monitor logs and scaling options

## Known Limitations

- Mobile app version not available
- Limited payment methods (only Razorpay)
- No real-time chat support
- Inventory management is basic
- No advanced analytics dashboard
- Email notifications not implemented
- Social media login not supported

## Future Enhancements

- Mobile application (React Native)
- Advanced search with AI recommendations
- Multi-language support
- Email/SMS notifications
- Advanced analytics and reporting
- Social media integration
- Loyalty program and rewards
- Advanced inventory management
- AR try-on feature
- Multi-vendor marketplace
- Advanced review system with images

## Contributing Guidelines

1. **Fork the Repository**
   - Create a fork of the project

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Code Standards**
   - Follow ESLint configuration
   - Use meaningful commit messages
   - Write descriptive component/function names

4. **Testing**
   - Test all changes thoroughly
   - Ensure no breaking changes
   - Test on multiple devices/browsers

5. **Pull Request**
   - Create detailed PR description
   - Reference related issues
   - Wait for code review

6. **Commit Message Format**
   ```
   type(scope): description

   [optional body]

   [optional footer]
   ```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author Information

**Project Lead**: [Your Name]
**Email**: [your.email@example.com]
**LinkedIn**: [Your LinkedIn Profile]
**GitHub**: [Your GitHub Profile]

---

*Built with ❤️ using React, Node.js, and MongoDB*
