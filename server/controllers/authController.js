import Admin from "../models/adminModel.js";
import Restaurant from "../models/restaurantModel.js";
import Users from "../models/userModel.js";

export const signInAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the admin user exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Admin not found for username: " + username });
    }

    // Replace with proper password hashing and comparison logic
    if (password !== admin.password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create and return a JWT token
    const token = admin.createJWT();

    res.status(200).json({
      success: true,
      message: "Admin signed in successfully",
      admin: {
        _id: admin._id,
        username: admin.username,
      },
      token,
    });
  } catch (error) {
    console.error("Error signing in admin: ", error);
    res
      .status(500)
      .json({ message: "Error signing in admin", error: error.message });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { email, password, candidateData } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new Users({
      email,
      password,
      name: candidateData.Name,
      aadhar: candidateData.Aadhar,
      contact: candidateData.Mobile_Number,
      location: candidateData.Location,
      department: candidateData.Department,
      position: candidateData.Department,
      cuisine: candidateData.Cuisine,
      currentSalary: candidateData.Salary,
      isTermsAccepted: true,
      isAbroadStudent: candidateData.IsAbroadStudent,
    });

    const savedUser = await newUser.save();
    const token = savedUser.createJWT();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
      token,
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Sign In User
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.createJWT();

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error signing in user: ", error);
    res
      .status(500)
      .json({ message: "Error signing in user", error: error.message });
  }
};

// Register a new restaurant

export const registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, restaurantData } = req.body;

    // Check if restaurant with the same email already exists
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new restaurant instance
    const newRestaurant = new Restaurant({
      restaurantName: name,
      email,
      password,
      restaurantCity: restaurantData.city,
      mobileNumber: restaurantData.mobileNumber,
    });

    // Save the restaurant to the database
    const savedRestaurant = await newRestaurant.save();

    // Generate JWT token for authentication
    const token = savedRestaurant.createJWT();

    // Respond with success message and token
    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant: savedRestaurant,
      token,
    });
  } catch (error) {
    console.error("Error registering restaurant:", error);

    if (error.name === "ValidationError") {
      // Extract validation error messages
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation errors", errors });
    }

    res
      .status(500)
      .json({ message: "Error registering restaurant", error: error.message });
  }
};

// Sign In Restaurant
export const signInRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (password !== restaurant.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = restaurant.createJWT();

    res.status(200).json({
      success: true,
      message: "Restaurant signed in successfully",
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error signing in restaurant: ", error);
    res
      .status(500)
      .json({ message: "Error signing in restaurant", error: error.message });
  }
};
