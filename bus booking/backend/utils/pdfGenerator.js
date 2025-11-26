const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateTicketPDF = async (ticketData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('BUS TICKET', 50, 50);
      doc.fontSize(12).text('Customer Support: support@busbooking.com', 50, 80);

      // Ticket Details
      doc.fontSize(14).text(`Ticket Number: ${ticketData.ticketNumber}`, 50, 120);
      doc.text(`Passenger Name: ${ticketData.userName}`, 50, 140);
      doc.text(`From: ${ticketData.from}`, 50, 160);
      doc.text(`To: ${ticketData.to}`, 50, 180);
      doc.text(`Bus: ${ticketData.busName}`, 50, 200);
      doc.text(`Seat Number: ${ticketData.seatNumber}`, 50, 220);
      doc.text(`Price: ₹${ticketData.price}`, 50, 240);
      doc.text(`Booking Date: ${new Date(ticketData.date).toLocaleDateString()}`, 50, 260);
      doc.text(`Departure: ${ticketData.departureTime}`, 50, 280);
      doc.text(`Arrival: ${ticketData.arrivalTime}`, 50, 300);

      // QR Code
      const qrData = `Ticket: ${ticketData.ticketNumber}, Passenger: ${ticketData.userName}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData);
      const qrCodeBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
      doc.image(qrCodeBuffer, 400, 120, { width: 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF };