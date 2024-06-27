import Jobs from "../models/jobsModel.js";
import Restaurant from "../models/restaurantModel.js";
import Users from "../models/userModel.js";

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Jobs.aggregate([
      {
        $lookup: {
          from: 'users', // Use lowercase collection name
          localField: 'applicants',
          foreignField: '_id',
          as: 'applicants',
        },
      },
      {
        $project: {
          _id: 1,
          restaurantName: 1,
          jobDesignation: 1,
          salary: 1,
          location: 1,
          jobType: 1,
          jobDepartment: 1,
          kitchenCuisine: 1,
          country: 1,
          applicants: {
            _id: 1,
            name: 1,
            email: 1,
            contact: 1,
            department: 1,
            position: 1,
            currentSalary: 1,
          },
        },
      },
    ]);

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching job applications', error: error.message });
  }
};

// Job operations
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      kitchenCuisine,
      country,
      cuisine,
    } = req.body;

    // Check for required fields
    if (
      !restaurantName ||
      !jobDesignation ||
      !salary ||
      !location ||
      !jobType ||
      !jobDepartment
    ) {
      return res.status(400).json({ message: "Please Provide All Required Fields" });
    }

    // Initialize the jobPost object
    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      cuisine:kitchenCuisine,
      country: country || "India", // Default to India if country is not provided
    };

    // If jobDepartment is 'Kitchen', ensure cuisine is provided
    if (jobDepartment === "Kitchen") {
      if (!cuisine) {
        return res.status(400).json({ message: "Cuisine is required for Kitchen department" });
      }
      jobPost.cuisine = cuisine;
    }

    // Create a new job instance and save it to the database
    const newJob = new Jobs(jobPost);
    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
};
export const createabroadJob = async (req, res) => {
  try {
    const {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      kitchenCuisine,
      country,
      cuisine,
    } = req.body;

    if (
      !restaurantName ||
      !jobDesignation ||
      !salary ||
      !location ||
      !jobType ||
      !jobDepartment
    ) {
      return res
        .status(400)
        .json({ message: "Please Provide All Required Fields" });
    }

    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      kitchenCuisine,
      country: country || "India", // Default to India if country is not provided
    };

    if (jobDepartment === "Kitchen") {
      if (!cuisine) {
        return res
          .status(400)
          .json({ message: "Cuisine is required for Kitchen department" });
      }
      jobPost.cuisine = cuisine;
    }

    const newJob = new Jobs(jobPost);
    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating job", error: error.message });
  }
};


// Restaurant operations
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurants", error: error.message });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding restaurant", error: error.message });
  }
};

// User operations
export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Jobs.findByIdAndDelete(id);
    // Remove this job from users' appliedJobs
    await Users.updateMany(
      { appliedJobs: id },
      { $pull: { appliedJobs: id } }
    );
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting job", error: error.message });
  }
};


export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    // Delete all jobs associated with this restaurant
    const deletedJobs = await Jobs.find({ restaurantName: id }).select('_id');
    await Jobs.deleteMany({ restaurantName: id });
    // Remove these jobs from users' appliedJobs
    await Users.updateMany(
      { appliedJobs: { $in: deletedJobs } },
      { $pull: { appliedJobs: { $in: deletedJobs } } }
    );
    res.json({ message: "Restaurant and associated jobs deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting restaurant", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndDelete(id);
    // Remove this user from all job applications
    await Jobs.updateMany(
      { applicants: id },
      { $pull: { applicants: id } }
    );
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting user", error: error.message });
  }
};