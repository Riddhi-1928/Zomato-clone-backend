import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';



dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // convert to paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};



// Get __dirname compatible with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const saveOrder = async (req, res) => {
  try {
    const { paymentId, orderId, signature, cartItems, totalAmount, deliveryAddress } = req.body;

    // Generate invoice path
    const invoicePath = path.join(__dirname, '../invoices', `invoice_${paymentId}.pdf`);


    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(16).text('Zomato Clone - Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Payment ID: ${paymentId}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Delivery Address: ${deliveryAddress}`);
    doc.moveDown();

    doc.text('Ordered Items:');
    cartItems.forEach(item => {
      doc.text(`${item.name} x${item.qty} - ₹${item.price * item.qty}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount Paid: ₹${totalAmount}`, { align: 'right' });

    doc.end();

    return res.status(200).json({
      message: 'Order saved and invoice generated',
      invoiceUrl: `/invoices/invoice_${paymentId}.pdf`
    });

  } catch (err) {
    console.error('❌ Save Order Error:', err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ Controller to serve invoice PDF
export const getInvoiceByPaymentId = (req, res) => {
  const { paymentId } = req.params;
  const invoicePath = path.join(__dirname, '../invoices', `invoice_${paymentId}.pdf`);

  if (fs.existsSync(invoicePath)) {
    res.sendFile(invoicePath);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
};