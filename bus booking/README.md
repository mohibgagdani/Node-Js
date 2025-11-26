# Bus Ticket Booking Web App

A complete full-stack bus booking application built with Vite + React + Node.js + MongoDB + Nodemailer OTP system.

## 🔥 Tech Stack

- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **OTP System**: NodeMailer
- **PDF Generation**: PDFKit
- **File Export**: CSV Writer

## 🚀 Features

### User Features
- ✅ User registration with OTP verification
- ✅ Login/Logout with JWT authentication
- ✅ Browse available bus routes and offers
- ✅ Book tickets with seat selection
- ✅ Instant payment processing
- ✅ PDF ticket generation and email delivery
- ✅ View booking history and transactions
- ✅ Profile management
- ✅ Password change with OTP verification
- ✅ Account deletion with OTP verification
- ✅ Forgot password with OTP reset
- ✅ Dark/Light mode toggle
- ✅ Responsive design

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Manage bus routes (CRUD operations)
- ✅ Manage offers (CRUD operations)
- ✅ View and manage users
- ✅ View booking history
- ✅ Export booking data to CSV
- ✅ Revenue and booking analytics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Gmail account for email services

## 🛠 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd bus-booking
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Update the `.env` file in the backend directory:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/busbooking
JWT_SECRET=your_jwt_secret_key_here_make_it_strong
EMAIL_USER=mohib.gagdani1@gmail.com
EMAIL_PASS=gaivquomqnpqcoia
EMAIL_APP_NAME=Busbooking
```

### 4. Seed Sample Data
```bash
node seedData.js
```

### 5. Start Backend Server
```bash
npm run dev
# or
npm start
```

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🔐 Default Admin Credentials

- **Email**: admin@gmail.com
- **Password**: admin@12345

## 📱 Application Flow

### 1. Landing Page
- Display available bus routes
- Show current offers
- User-friendly interface with modern UI/UX
- Login/Register prompts for booking

### 2. User Registration
- Name, Email, Phone, Password required
- OTP verification via email
- Account activation after OTP verification

### 3. User Login
- Email + Password authentication
- JWT token-based sessions

### 4. Booking Process
- Browse available routes
- Select seats
- Instant payment processing
- PDF ticket generation
- Email delivery with ticket attachment

### 5. Admin Panel
- Complete dashboard with analytics
- Manage routes, offers, and users
- Export booking data
- Revenue tracking

## 🗄 Database Collections

### Users
- userId, name, email, password (encrypted), phone
- ticketHistory, transactionHistory
- accountCreatedDate, isVerified

### Admin
- adminId, email, password (encrypted)

### BusRoute
- routeId, busName, from, to
- departureTime, arrivalTime, price
- totalSeats, availableSeats

### Offers
- offerId, offerTitle, offerDescription
- discountValue, validTill

### Bookings
- bookingId, userId, routeId, seatNumber
- paymentStatus, pdfTicketURL, date, ticketNumber

### OTP
- email, otp, generatedAt, expiresAt, usedOrNot

## 🎨 UI Features

- ✅ Clean modern design
- ✅ Dark/Light mode toggle
- ✅ Responsive mobile design
- ✅ Professional buttons and forms
- ✅ Loading states and animations
- ✅ Toast notifications

## 📧 Email System

OTP emails sent for:
- Account verification
- Password reset
- Password change
- Account deletion

Ticket emails include:
- Booking confirmation
- PDF ticket attachment
- Journey details

## 🔒 Security Features

- ✅ Password encryption with bcrypt
- ✅ JWT authentication
- ✅ OTP verification for sensitive actions
- ✅ Protected routes (frontend & backend)
- ✅ Input validation and sanitization

## 🚀 Deployment Ready

- Environment-based configuration
- Production-ready code structure
- Error handling and logging
- Scalable architecture

## 📞 Support

For any issues or questions, contact: support@busbooking.com

## 🎯 Usage Instructions

1. Start MongoDB service
2. Run backend server: `npm run dev` (in backend directory)
3. Run frontend server: `npm run dev` (in frontend directory)
4. Access application at `http://localhost:5173`
5. Admin panel at `http://localhost:5173/admin/login`

## 🔧 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/verify-otp` - OTP verification
- POST `/api/auth/login` - User login
- POST `/api/auth/admin/login` - Admin login
- POST `/api/auth/forgot-password` - Forgot password
- POST `/api/auth/reset-password` - Reset password

### Bus Routes
- GET `/api/bus/routes` - Get all routes
- GET `/api/bus/offers` - Get all offers

### Bookings
- POST `/api/booking/book` - Create booking
- GET `/api/booking/my-bookings` - User bookings

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/routes` - Manage routes
- GET `/api/admin/offers` - Manage offers
- GET `/api/admin/users` - Manage users
- GET `/api/admin/export/bookings` - Export CSV

## 📄 License

This project is licensed under the MIT License.