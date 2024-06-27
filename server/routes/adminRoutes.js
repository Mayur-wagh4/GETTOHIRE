import express from "express";
import {
  addRestaurant,
  createJob,
  createabroadJob,
  deleteJob,
  deleteRestaurant,
  deleteUser,
  getAllApplications,
  getAllJobs,
  getAllRestaurants,
  getAllUsers
} from "../controllers/AdminController.js";

const router = express.Router();

// Job routes
router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);
router.post("/upload-job", createJob);
router.post("/upload-abroad-job", createabroadJob);
router.delete("/jobs/:id", deleteJob);
// Restaurant routes
router.get("/restaurants", getAllRestaurants);
router.post("/restaurant-add", addRestaurant);
// Users routes 
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.delete("/restaurants/:id", deleteRestaurant);
export default router;
