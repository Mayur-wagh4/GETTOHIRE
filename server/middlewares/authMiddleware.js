import jwt from 'jsonwebtoken';
import Restaurant from '../models/restaurantModel.js';
import User from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith('Bearer')) {
    return next("Authentication failed");
  }

  const token = authHeader?.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token belongs to a regular user or a restaurant user
    let foundUser;
    if (decodedToken.userType === 'user') {
      foundUser = await User.findById(decodedToken.userId);
    } else if (decodedToken.userType === 'restaurant') {
      foundUser = await Restaurant.findById(decodedToken.userId);
    } else {
      // Handle the case when userType is not present in the decoded token
      foundUser = await User.findById(decodedToken.userId);
      if (!foundUser) {
        foundUser = await Restaurant.findById(decodedToken.userId);
      }
    }

    if (!foundUser) {
      return next("Authentication failed"); // User or restaurant not found
    }

    // Attach user information to request object
    req.body.user = {
      userId: foundUser._id,
      userType: decodedToken.userType || 'user', // Fallback to 'user' if userType is not present
    };

    next();
  } catch (error) {
    console.error(error);
    return next("Authentication failed");
  }
};

export default userAuth;