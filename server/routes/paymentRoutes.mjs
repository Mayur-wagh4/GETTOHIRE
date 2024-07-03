import express from 'express';
import { checkPaymentStatus, initiatePayment,handlePaymentCallback } from '../controllers/paymentController.mjs';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/callback', handlePaymentCallback);
router.get('/status', checkPaymentStatus);

export default router;
