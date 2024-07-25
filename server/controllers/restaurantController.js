import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Restaurant from "../models/restaurantModel.js";
import Transactions from "../models/transactionModel.js";

dotenv.config();

const {
  MERCHANT_ID,
  SALT_KEY,
  PAYMENT_REDIRECT_URL,
  PAYMENT_CALLBACK_URL_2,
  PHONEPE_BASE_URL,
} = process.env;

const saltIndex = "1";

const createChecksum = (payload, endpoint) => {
  const string = payload + endpoint + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  return `${sha256}###${saltIndex}`;
};

const initiatePayment = async (paymentData) => {
  const { userId, name, amount, number, userType } = paymentData;
  const transactionId = `T${Date.now()}`;

  const data = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: `MUID${userId}`,
    amount: amount * 100,
    redirectUrl: `${PAYMENT_REDIRECT_URL}${transactionId}`,
    redirectMode: "GET",
    callbackUrl: PAYMENT_CALLBACK_URL_2,
    mobileNumber: number,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = Buffer.from(JSON.stringify(data)).toString("base64");
  const checksum = createChecksum(payload, "/pg/v1/pay");

  const options = {
    method: "POST",
    url: `${PHONEPE_BASE_URL}/pay`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: payload,
    },
  };

  const response = await axios.request(options);

  if (response.data.success) {
    await Transactions.create({
      userId,
      userType,
      transactionId,
      amount,
      status: "INITIATED",
    });

    return {
      success: true,
      message: "Payment initiated successfully",
      paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId: transactionId,
    };
  } else {
    throw new Error("Failed to initiate payment");
  }
};

export const handlePaymentCallback = async (req, res) => {
  try {
    const { transactionId, status, checksum } = req.body;

    // Verify the callback authenticity
    if (!verifyPaymentCallback(transactionId, status, checksum)) {
      return res.status(400).json({ success: false, message: 'Invalid callback' });
    }

    const transaction = await Transactions.findOneAndUpdate(
      { transactionId: transactionId },
      { $set: { status: status } },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (status === 'COMPLETED') {
      // Logic to create job post
      // This should be moved to a separate function and called here
    }

    res.status(200).json({ success: true, message: 'Callback processed successfully' });
  } catch (error) {
    console.error('Error processing payment callback:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const checkPaymentStatus = async (req, res) => {
  const { transactionId } = req.params;
  const url = `${PHONEPE_BASE_URL}/status/${MERCHANT_ID}/${transactionId}`;

  const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${transactionId}${SALT_KEY}`;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const xVerify = `${sha256}###${saltIndex}`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-MERCHANT-ID": MERCHANT_ID,
      "X-VERIFY": xVerify,
    },
  };

  try {
    const response = await axios.request(options);

    if (response.data.success) {
      const paymentData = response.data.data;
      res.json({
        success: true,
        state: paymentData.state,
        responseCode: paymentData.responseCode,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to check payment status" });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
      cuisine,
      transactionId,
      numberOfRequirements,
    } = req.body;

    if (!transactionId) {
      return res
        .status(400)
        .json({ message: "Payment transaction ID is required" });
    }

    // Verify payment status
    const paymentStatus = await checkPaymentStatus(transactionId);
    if (paymentStatus.state !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    if (
      !restaurantName ||
      !jobDesignation ||
      !salary ||
      !location ||
      !jobType ||
      !jobDepartment ||
      !numberOfRequirements
    ) {
      return res
        .status(400)
        .json({ message: "Please Provide All Required Fields" });
    }

    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(404)
        .json({ message: `No restaurant with id: ${restaurantId}` });
    }

    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      jobType,
      jobDepartment,
      cuisine,
      country: "India",
      numberOfRequirements,
    };

    if (jobDepartment === "Kitchen" && !cuisine) {
      return res
        .status(400)
        .json({ message: "Cuisine is required for Kitchen department" });
    }

    const job = new Jobs(jobPost);
    await job.save();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: `No restaurant with id: ${restaurantId}` });
    }

    restaurant.jobPosts.push(job._id);
    await restaurant.save();

    // Update transaction status
    await Transactions.findOneAndUpdate(
      { transactionId: transactionId, userType: "Restaurant" },
      { $set: { status: "COMPLETED", jobId: job._id } }
    );

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createAbroadJob = async (req, res) => {
  try {
    const {
      restaurantName,
      jobDesignation,
      salary,
      location,
      accommodation,
      jobType,
      jobDepartment,
      cuisine,
      country,
      transactionId,
      numberOfRequirements,
    } = req.body;

    if (!transactionId) {
      return res
        .status(400)
        .json({ message: "Payment transaction ID is required" });
    }

    // Verify payment status
    const paymentStatus = await checkPaymentStatus(transactionId);
    if (paymentStatus.state !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    if (
      !restaurantName ||
      !jobDesignation ||
      !salary ||
      !location ||
      !jobType ||
      !jobDepartment ||
      !country ||
      !numberOfRequirements
    ) {
      return res
        .status(400)
        .json({ message: "Please Provide All Required Fields" });
    }

    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(404)
        .json({ message: `No restaurant with id: ${restaurantId}` });
    }

    const jobPost = {
      restaurantName,
      jobDesignation,
      salary,
      location,
      accommodation,
      jobType,
      jobDepartment,
      cuisine,
      country,
      numberOfRequirements,
    };

    const job = new Jobs(jobPost);
    await job.save();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: `No restaurant with id: ${restaurantId}` });
    }

    restaurant.jobPosts.push(job._id);
    await restaurant.save();

    // Update transaction status
    await Transactions.findOneAndUpdate(
      { transactionId: transactionId, userType: "Restaurant" },
      { $set: { status: "COMPLETED", jobId: job._id } }
    );

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

export const initiateJobPostPayment = async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const paymentData = {
      userId: restaurantId,
      name: restaurant.restaurantName,
      amount,
      number: restaurant.mobileNumber,
      userType: "Restaurant",
    };

    const paymentResponse = await initiatePayment(paymentData);

    if (!paymentResponse.success) {
      return res.status(400).json({ message: "Failed to initiate payment" });
    }

    res.json(paymentResponse);
  } catch (error) {
    console.error("Error initiating job post payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRestaurantProfile = async (req, res, next) => {
  try {
    const restaurantId = req.restaurant._id;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant Not Found" });
    }

    restaurant.password = undefined;

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRestaurantPostedJobs = async (req, res, next) => {
  try {
    const { restaurantId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(404)
        .json({ message: `Invalid Restaurant ID: ${restaurantId}` });
    }

    const restaurant = await Restaurant.findById(restaurantId).populate(
      "jobPosts"
    );

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: `Restaurant not found with ID: ${restaurantId}` });
    }

    res.status(200).json(restaurant.jobPosts);
  } catch (error) {
    console.error("Error fetching restaurant posted jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRestaurantProfile = async (req, res, next) => {
  const updateFields = {};
  const allowedFields = [
    "restaurantName",
    "email",
    "password",
    "mobileNumber",
    "restaurantCity",
    "typeOfCuisines",
    "dutyTimings",
    "foodAccommodation",
    "contact",
    "location",
    "about",
    "profileUrl",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field]) {
      updateFields[field] = req.body[field];
    }
  });

  try {
    const restaurantId = req.restaurant._id;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(404)
        .json({ message: `No Restaurant with id: ${restaurantId}` });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updateFields,
      {
        new: true,
      }
    );

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant Not Found" });
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
