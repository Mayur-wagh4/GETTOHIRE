import express from 'express';
import { checkPaymentStatus, initiatePayment } from '../controllers/paymentController.mjs';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/status', checkPaymentStatus);

export default router;
