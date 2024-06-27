import express from "express";
import { applyJob, getCandidateAppliedJobs, getJobById, getJobPosts, getUser, updateUser } from "../controllers/userController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);
router.post("/applied-jobs", userAuth, getCandidateAppliedJobs);
// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", userAuth, getJobById);
router.post("/apply-job", userAuth, applyJob);

export default router;
