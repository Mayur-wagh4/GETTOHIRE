import express from 'express';
import {
  checkPaymentStatus,
  createAbroadJob,
  createJob,
  getRestaurantPostedJobs,
  getRestaurantProfile,
  handlePaymentCallback,
  initiateJobPostPayment,
  updateRestaurantProfile
} from '../controllers/restaurantController.js';
import { restaurantAuth } from '../middlewares/restaurantMiddleware.mjs';

const router = express.Router();

// Profile routes
router.get("/get-restaurant-profile", restaurantAuth, getRestaurantProfile);
router.put("/update-restaurant-profile", restaurantAuth, updateRestaurantProfile);

// Job-related routes
router.post('/upload-job', restaurantAuth, createJob);
router.post('/upload-abroad-job', restaurantAuth, createAbroadJob);
router.get('/get-restaurant-jobs', restaurantAuth, getRestaurantPostedJobs);
// Payment routes
router.get('/check-payment-status/:transactionId', checkPaymentStatus);
router.post('/initiate-job-post-payment', restaurantAuth, initiateJobPostPayment);
router.post('/payment-callback', handlePaymentCallback);

export default router;