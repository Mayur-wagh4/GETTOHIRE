import mongoose from "mongoose";
import Jobs from '../models/jobsModel.js';
import Users from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  const {
    name,
    email,
    contact,
    location,
    department,
    position,
    cuisine,
    currentSalary,
    isAbroadStudent,
  } = req.body;

  try {
    // Check for required fields
    if (!name || !email || !contact || !location || !department || !position || currentSalary === undefined || isAbroadStudent === undefined) {
      throw new Error("Please provide all required fields");
    }

    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `No User with id: ${userId}` });
    }

    const updateUser = {
      name,
      email,
      contact,
      location,
      department,
      position,
      cuisine,
      currentSalary,
      isAbroadStudent,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, { new: true });

    if (!user) {
      return res.status(404).json({ message: `User not found with id: ${userId}` });
    }

    const token = user.createJWT();
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: `User not found with id: ${userId}` });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCandidateAppliedJobs = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findById(userId).populate('appliedJobs');

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    res.status(200).json(user.appliedJobs);
  } catch (error) {
    console.error('Error fetching candidate applied jobs:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getJobPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const jobs = await Jobs.find().skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    const totalJobs = await Jobs.countDocuments();

    console.log(`Fetched ${jobs.length} jobs out of ${totalJobs} total jobs`);

    res.status(200).json({
      success: true,
      total: totalJobs,
      jobs,
      page,
      pages: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Job with id: ${id}`);
    }

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job Not Found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const applyJob = async (req, res, next) => {
  try {
    const { userId, jobId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      console.log(`Invalid user ID: ${userId} or job ID: ${jobId}`);
      return res.status(404).send(`Invalid user ID or job ID`);
    }

    const user = await Users.findById(userId);
    const job = await Jobs.findById(jobId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    if (!job) {
      console.log(`Job with ID ${jobId} not found`);
      return res.status(404).json({ message: `Job with ID ${jobId} not found` });
    }

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
      console.log(`User with ID ${userId} applied for job ID ${jobId}`);

      if (!job.applicants.includes(userId)) {
        job.applicants.push(userId);
        await job.save();
        console.log(`Added user ID ${userId} to applicants for job ID ${jobId}`);
      }

      res.status(200).json({
        success: true,
        message: 'Job applied successfully',
        appliedJobs: user.appliedJobs,
      });
    } else {
      console.log(`User with ID ${userId} has already applied for job ID ${jobId}`);
      res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
        appliedJobs: user.appliedJobs,
      });
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};