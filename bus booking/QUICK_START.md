# 🚀 Quick Start Guide

## Prerequisites
1. **MongoDB** must be running on `mongodb://localhost:27017/`
2. **Node.js** (v14+) installed

## 🏃‍♂️ Quick Setup (3 steps)

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Seed Sample Data
```bash
cd backend
node seedData.js
```

### 3. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Admin Panel**: http://localhost:5173/admin/login

## 🔐 Default Credentials

**Admin Login:**
- Email: `admin@gmail.com`
- Password: `admin@12345`

## 📧 Email Configuration

The app uses Gmail for sending OTP emails. The credentials are already configured in `.env`:
- Email: `mohib.gagdani1@gmail.com`
- App Password: `gaivquomqnpqcoia`

## ✅ Features Working

### User Features:
- ✅ Registration with OTP verification
- ✅ Login/Logout with JWT
- ✅ Browse bus routes and offers
- ✅ Book tickets with seat selection
- ✅ PDF ticket generation & email
- ✅ View booking/transaction history
- ✅ Profile management
- ✅ Password change with OTP
- ✅ Account deletion with OTP
- ✅ Forgot password with OTP
- ✅ Dark/Light mode toggle
- ✅ Responsive design

### Admin Features:
- ✅ Dashboard with analytics
- ✅ Manage bus routes (CRUD)
- ✅ Manage offers (CRUD)
- ✅ View/manage users
- ✅ Booking history
- ✅ Export CSV data
- ✅ Revenue tracking

## 🗄️ Database Collections

The app automatically creates these MongoDB collections:
- `users` - User accounts and history
- `admins` - Admin accounts  
- `busroutes` - Bus route information
- `offers` - Promotional offers
- `bookings` - Ticket bookings
- `otps` - OTP verification codes

## 🎯 Sample Data Included

- 5 bus routes (Mumbai-Pune, Delhi-Agra, etc.)
- 3 promotional offers
- Default admin account

## 🔧 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb/brew/mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173  
lsof -ti:5173 | xargs kill -9
```

**Email Issues:**
- Emails are sent via Gmail SMTP
- Check spam folder for OTP emails
- Ensure internet connection for email delivery

## 📱 Testing the App

1. **Register a new user** - You'll receive OTP via email
2. **Verify OTP** - Account gets activated
3. **Login** - Browse available routes
4. **Book a ticket** - Select seat and pay
5. **Check email** - PDF ticket will be sent
6. **Admin panel** - Login with admin credentials

## 🎨 UI Features

- Modern, clean design
- Dark/Light mode toggle
- Responsive mobile layout
- Loading states & animations
- Toast notifications
- Professional forms & buttons

## 🔒 Security Features

- Password encryption (bcrypt)
- JWT authentication
- OTP verification for sensitive actions
- Protected routes (frontend & backend)
- Input validation & sanitization

## 📞 Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify all dependencies are installed
3. Check console for error messages
4. Ensure ports 5000 and 5173 are available

**Contact**: support@busbooking.com

---

🎉 **You're all set! The complete bus booking application is ready to use.**