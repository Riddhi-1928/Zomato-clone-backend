import express from 'express';
import { createOrder, verifyPayment,saveOrder,getInvoiceByPaymentId} from '../controllers/paymentController.mjs';

const router = express.Router();

// Create Order
router.post('/create-order', createOrder);

// Verify Signature
router.post('/verify-payment', verifyPayment);

// Save order
router.post('/save-order', saveOrder);

// Invoice
router.get('/invoice/:paymentId', getInvoiceByPaymentId);

export default router;