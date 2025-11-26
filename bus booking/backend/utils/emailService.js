const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.EMAIL_APP_NAME} - OTP Verification`,
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP for verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendTicketEmail = async (email, ticketData, pdfBuffer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.EMAIL_APP_NAME} - Your Bus Ticket`,
    html: `
      <h2>Bus Ticket Confirmation</h2>
      <p>Dear ${ticketData.userName},</p>
      <p>Your bus ticket has been booked successfully!</p>
      <p><strong>Ticket Number:</strong> ${ticketData.ticketNumber}</p>
      <p><strong>Route:</strong> ${ticketData.from} to ${ticketData.to}</p>
      <p><strong>Seat Number:</strong> ${ticketData.seatNumber}</p>
      <p><strong>Date:</strong> ${new Date(ticketData.date).toLocaleDateString()}</p>
      <p>Please find your ticket attached.</p>
    `,
    attachments: [{
      filename: `ticket-${ticketData.ticketNumber}.pdf`,
      content: pdfBuffer
    }]
  };

  await transporter.sendMail(mailOptions);
};

const sendCancellationEmail = async (email, cancellationData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${process.env.EMAIL_APP_NAME} - Ticket Cancellation Confirmation`,
    html: `
      <h2>Ticket Cancellation Confirmation</h2>
      <p>Dear ${cancellationData.userName},</p>
      <p>Your bus ticket has been cancelled successfully!</p>
      <p><strong>Ticket Number:</strong> ${cancellationData.ticketNumber}</p>
      <p><strong>Bus:</strong> ${cancellationData.busName}</p>
      <p><strong>Route:</strong> ${cancellationData.from} to ${cancellationData.to}</p>
      <p><strong>Journey Date:</strong> ${new Date(cancellationData.journeyDate).toLocaleDateString()}</p>
      <p><strong>Refund Amount:</strong> ₹${cancellationData.refundAmount}</p>
      <p>Your refund will be processed within 5-7 business days.</p>
      <p>Thank you for choosing ${process.env.EMAIL_APP_NAME}!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendTicketEmail, sendCancellationEmail };