import express from "express";

import adminRoute from './adminRoutes.js';
import authRoute from "./authRoutes.js";

import paymentRoute from './paymentRoutes.mjs';
import restaurantRoute from "./restaurantRoutes.js";
import userRoute from "./userRoutes.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute);
router.use(`${path}candidates`, userRoute);
router.use(`${path}restaurants`, restaurantRoute);
router.use(`${path}admin`, adminRoute);
router.use(`${path}payment`, paymentRoute);



export default router;
