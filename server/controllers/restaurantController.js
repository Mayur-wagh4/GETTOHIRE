import mongoose from 'mongoose';
import Jobs from '../models/jobsModel.js';
import Restaurant from '../models/restaurantModel.js';

export const createJob = async (req, res, next) => {
  try {
    const {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      cuisine,
    } = req.body;

    if (!restaurantName || !jobDesignation || !salary || !location || !jobType || !jobDepartment) {
      return res.status(400).json({ message: "Please Provide All Required Fields" });
    }

    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(404).json({ message: `No restaurant with id: ${restaurantId}` });
    }

    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      cuisine,
      country: 'India',
    };

    if (jobDepartment === 'Kitchen' && !cuisine) {
      return res.status(400).json({ message: "Cuisine is required for Kitchen department" });
    }

    if (jobDepartment === 'Kitchen') {
      jobPost.cuisine = cuisine;
    }

    const job = new Jobs(jobPost);
    await job.save();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: `No restaurant with id: ${restaurantId}` });
    }

    restaurant.jobPosts.push(job._id);
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "India Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createAbroadJob = async (req, res, next) => {
  try {
    const {
      restaurantName,
      jobDesignation,
      salary,
      location,
      accommodation,
      jobType,
      jobDepartment,
      kitchenCuisine,
      country,
    } = req.body;

    if (!restaurantName || !jobDesignation || !salary || !location || !jobType || !jobDepartment || !country) {
      return res.status(400).json({ message: "Please Provide All Required Fields" });
    }

    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(404).json({ message: `No restaurant with id: ${restaurantId}` });
    }

    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      accommodation,
      jobType,
      jobDepartment,
      kitchenCuisine,
      country,
    };

    const job = new Jobs(jobPost);
    await job.save();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: `No restaurant with id: ${restaurantId}` });
    }

    restaurant.jobPosts.push(job._id);
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Abroad Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getRestaurantProfile = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant._id;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant Not Found' });
    }

    restaurant.password = undefined;

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const getRestaurantPostedJobs = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(404).json({ message: `Invalid Restaurant ID: ${restaurantId}` });
    }

    const restaurant = await Restaurant.findById(restaurantId).populate('jobPosts');

    if (!restaurant) {
      return res.status(404).json({ message: `Restaurant not found with ID: ${restaurantId}` });
    }

    res.status(200).json(restaurant.jobPosts);
  } catch (error) {
    console.error('Error fetching restaurant posted jobs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const updateRestaurantProfile = async (req, res, next) => {
  const updateFields = {};
  const allowedFields = ['restaurantName', 'email', 'password', 'mobileNumber', 'restaurantCity', 'typeOfCuisines', 'dutyTimings', 'foodAccommodation', 'contact', 'location', 'about', 'profileUrl'];

  allowedFields.forEach(field => {
    if (req.body[field]) {
      updateFields[field] = req.body[field];
    }
  });

  try {
    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(404).json({ message: `No Restaurant with id: ${restaurantId}` });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateFields, {
      new: true,
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant Not Found' });
    }

    const token = restaurant.createJWT();
    restaurant.password = undefined;

    res.status(200).json({
      success: true,
      message: "Restaurant Profile Updated Successfully",
      restaurant,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
