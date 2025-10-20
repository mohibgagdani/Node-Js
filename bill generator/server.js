import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';
import multer from 'multer';

const app = express();
const PORT = 3001;

const MONGODB_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'billingsystem';
let db;

MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(error => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohib.gagdani1@gmail.com',
    pass: 'turvlymkivufzkiw'
  }
});

app.post('/api/send-bill', upload.single('pdfFile'), async (req, res) => {
  try {
    const { email, billData } = req.body;
    const pdfBuffer = req.file?.buffer;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!pdfBuffer) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const parsedBillData = typeof billData === 'string' ? JSON.parse(billData) : billData;

    const billRecord = {
      ...parsedBillData,
      email,
      createdAt: new Date(),
      status: 'sent'
    };

    const result = await db.collection('bills').insertOne(billRecord);

    
    const mailOptions = {
      from: 'mohib.gagdani1@gmail.com',
      to: email,
      subject: `Invoice ${parsedBillData.invoice?.number || 'N/A'} - ${parsedBillData.yourCompany?.name || 'Your Company'}`,
      html: `
        <h2>Invoice Generated</h2>
        <p>Dear ${parsedBillData.billTo?.name || 'Customer'},</p>
        <p>Please find your invoice attached.</p>
        <p><strong>Invoice Details:</strong></p>
        <ul>
          <li>Invoice Number: ${parsedBillData.invoice?.number || 'N/A'}</li>
          <li>Date: ${parsedBillData.invoice?.date || 'N/A'}</li>
          <li>Total Amount: ${parsedBillData.grandTotal || 0}</li>
        </ul>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>${parsedBillData.yourCompany?.name || 'Your Company'}</p>
      `,
      attachments: [
        {
          filename: `invoice_${parsedBillData.invoice?.number || Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Bill sent successfully and saved to database',
      billId: result.insertedId
    });

  } catch (error) {
    console.error('Error sending bill:', error);
    res.status(500).json({ error: 'Failed to send bill: ' + error.message });
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const bills = await db.collection('bills').find({}).sort({ createdAt: -1 }).toArray();
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});