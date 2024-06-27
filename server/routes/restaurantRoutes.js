import express from 'express';
import { createAbroadJob, createJob, getRestaurantPostedJobs, getRestaurantProfile, updateRestaurantProfile } from '../controllers/restaurantController.js';
import { restaurantAuth } from '../middlewares/restaurantMiddleware.mjs';

const router = express.Router();

router.get("/get-restaurant-profile", restaurantAuth, (req, res, next) => {
  console.log('Fetching restaurant profile');
  getRestaurantProfile(req, res, next);
});

router.get("/get-restaurant-jobs", restaurantAuth, (req, res, next) => {
  console.log('Fetching restaurant job listing');
  getRestaurantPostedJobs(req, res, next);
});

router.put("/update-restaurant-profile", restaurantAuth, (req, res, next) => {
  console.log('Updating restaurant profile');
  updateRestaurantProfile(req, res, next);
});
router.post('/upload-job', restaurantAuth, (req, res, next) => {
  console.log('Updating restaurant profile');
  createJob(req, res, next);
});
router.post('/upload-abroad-job', restaurantAuth, (req, res, next) => {
  console.log('Updating restaurant profile');
  createAbroadJob(req, res, next);
});
export default router;

