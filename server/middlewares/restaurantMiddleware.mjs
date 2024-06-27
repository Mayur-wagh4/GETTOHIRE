import jwt from 'jsonwebtoken';
import Restaurant from '../models/restaurantModel.js'; // Adjust path based on your project structure

export const restaurantAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed. Token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const restaurant = await Restaurant.findById(decodedToken.userId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    req.restaurant = restaurant; // Attach restaurant object to request for further processing if needed
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

export default restaurantAuth;
