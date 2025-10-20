# Bill Generator with Email Integration Setup

## Prerequisites
1. MongoDB installed and running on `mongodb://localhost:27017/`
2. Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

### 3. Start the Application

#### Option 1: Start both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Start separately
Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Features Added

### Email Integration
- **Email Required**: Bills cannot be generated without providing a customer email
- **Automatic Email Sending**: Generated bills are automatically sent to the provided email
- **Email Modal**: User-friendly modal to collect email addresses

### MongoDB Integration
- **Data Storage**: All bill data is automatically saved to MongoDB
- **Database**: `billingsystem`
- **Collection**: `bills`

### Email Configuration
- **Service**: Gmail
- **App Name**: billingsystem
- **App Password**: turvlymkivufzkiw

## Usage

1. Fill in all required bill information
2. **Important**: Enter customer email address (required field)
3. Select a template to generate the bill
4. The bill will be automatically:
   - Generated as PDF
   - Sent to the customer's email
   - Saved to MongoDB database

## API Endpoints

- `POST /api/send-bill` - Send bill via email and save to database
- `GET /api/bills` - Retrieve all bills from database

## Database Schema

Bills are stored with the following structure:
```javascript
{
  billTo: { name, address, phone },
  shipTo: { name, address, phone },
  invoice: { date, paymentDate, number },
  yourCompany: { name, address, phone },
  items: [{ name, description, quantity, amount, total }],
  taxPercentage: Number,
  taxAmount: Number,
  subTotal: Number,
  grandTotal: Number,
  notes: String,
  selectedCurrency: String,
  customerEmail: String,
  createdAt: Date,
  status: String
}
```