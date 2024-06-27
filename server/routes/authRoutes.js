import express from "express";
import { rateLimit } from "express-rate-limit";
import { registerRestaurant, registerUser, signInAdmin, signInRestaurant, signInUser } from "../controllers/authController.js";

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

router.post('/register/candidate', registerUser);
router.post('/signin/candidate', signInUser);
router.post('/register/restaurant', registerRestaurant);
router.post('/signin/restaurant', signInRestaurant);
router.post('/signin/admin',signInAdmin)

export default router;
