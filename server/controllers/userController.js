import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createLogger, format, transports } from 'winston';
import Jobs from "../models/jobsModel.js";
import Transactions from "../models/transactionModel.js";
import Users from "../models/userModel.js";

dotenv.config();

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

const {
  MERCHANT_ID,
  SALT_KEY,
  PAYMENT_REDIRECT_URL,
  PAYMENT_CALLBACK_URL,
  PAYMENT_PENDING_URL,
  PAYMENT_SUCCESS_URL,
  PAYMENT_FAILED_URL,
  PHONEPE_BASE_URL,
} = process.env;

const saltIndex = "1";

const createChecksum = (payload, endpoint) => {
  const string = payload + endpoint + SALT_KEY;
  return `${crypto.createHash("sha256").update(string).digest("hex")}###${saltIndex}`;
};

const handleError = (res, error, message) => {
  logger.error(`${message}: ${error}`);
  res.status(500).json({
    success: false,
    message: "Internal server error. Please try again later.",
    error: error.message,
  });
};

export const initiatePayment = async (req, res) => {
  logger.info("Initiating payment...");
  try {
    const { userId, name, amount, number } = req.body;
    const transactionId = `T${Date.now()}`;

    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID${userId}`,
      amount: amount * 100,
      redirectUrl: `${PAYMENT_REDIRECT_URL}${transactionId}`,
      redirectMode: "GET",
      callbackUrl: PAYMENT_CALLBACK_URL,
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
        userType: "Users",
        transactionId,
        amount,
        status: "INITIATED",
      });

      res.json({
        success: true,
        message: "Payment initiated successfully.",
        paymentUrl: response.data.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment initiation failed.",
        error: response.data.message,
      });
    }
  } catch (error) {
    handleError(res, error, "Error initiating payment");
  }
};

export const handlePaymentCallback = async (req, res) => {
  try {
    const { merchantTransactionId, transactionId, responseCode } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required." });
    }

    const transaction = await Transactions.findOneAndUpdate(
      { transactionId: merchantTransactionId },
      {
        status: responseCode === "SUCCESS" ? "SUCCESS" : "FAILED",
        phonepeTransactionId: transactionId,
        responseCode: responseCode,
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    if (transaction.userType === "Users") {
      await updatePremiumStatus(transaction.userId, transaction.status === "SUCCESS");
    }

    res.status(200).json({ success: true, message: "Payment callback processed successfully." });
  } catch (error) {
    handleError(res, error, "Error processing payment callback");
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    console.log(`Checking payment status for transaction ID: ${transactionId}`);

    const url = `${PHONEPE_BASE_URL}/status/${MERCHANT_ID}/${transactionId}`;
    const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${transactionId}${SALT_KEY}`;
    const xVerify = `${crypto.createHash("sha256").update(stringToHash).digest("hex")}###${saltIndex}`;

    console.log(`Requesting payment status from PhonePe: ${url}`);

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

    const response = await axios.request(options);

    console.log(`Received response from PhonePe:`, response.data);

    if (response.data.success) {
      const paymentData = response.data.data;
      const { state } = paymentData;

      console.log(`Payment state: ${state}`);

      let redirectUrl;
      let user;
      if (state === "COMPLETED") {
        console.log(`Payment completed successfully`);
        redirectUrl = PAYMENT_SUCCESS_URL;
        user = await Users.findOneAndUpdate(
          { _id: paymentData.merchantUserId.substring(4) },
          { isPremium: true },
          { new: true }
        );
      } else if (state === "PENDING") {
        console.log(`Payment is still pending`);
        redirectUrl = PAYMENT_PENDING_URL;
      } else {
        console.log(`Payment failed or in an unexpected state`);
        redirectUrl = PAYMENT_FAILED_URL;
      }

      res.json({
        success: true,
        message: "Payment status fetched successfully.",
        transactionId: paymentData.transactionId,
        merchantTransactionId: paymentData.merchantTransactionId,
        amount: paymentData.amount,
        state: state,
        responseCode: paymentData.responseCode,
        paymentInstrument: paymentData.paymentInstrument,
        redirectUrl: redirectUrl,
        user: user ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          isPremium: user.isPremium
        } : undefined
      });
    } else {
      console.log(`Failed to fetch payment status from PhonePe`);
      res.json({
        success: false,
        message: "Failed to fetch payment status.",
        code: response.data.code,
        redirectUrl: PAYMENT_FAILED_URL,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    handleError(res, error, "Error checking payment status");
  }
};

const updatePremiumStatus = async (userId, isPremium) => {
  try {
    const user = await Users.findByIdAndUpdate(
      userId,
      { isPremium: isPremium },
      { new: true }
    );

    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return;
    }

    console.log(`Premium status updated for user: ${userId} to ${isPremium}`);
  } catch (error) {
    console.error("Error updating premium status:", error);
  }
};

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
    if (
      !name ||
      !email ||
      !contact ||
      !location ||
      !department ||
      !position ||
      currentSalary === undefined ||
      isAbroadStudent === undefined
    ) {
      throw new Error("Please provide all required fields.");
    }

    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
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

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found with ID: ${userId}` });
    }

    const token = user.createJWT();
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Your profile has been updated successfully.",
      user,
      token,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
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
      return res
        .status(404)
        .json({ message: `User not found with ID: ${userId}` });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const getCandidateAppliedJobs = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findById(userId).populate("appliedJobs");

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    res.status(200).json(user.appliedJobs);
  } catch (error) {
    console.error("Error fetching candidate applied jobs:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const jobs = await Jobs.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

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
    console.error("Error fetching job posts:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Job found with ID: ${id}`);
    }

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const { userId, jobId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      console.log(`Invalid user ID: ${userId} or job ID: ${jobId}`);
      return res.status(404).send(`Invalid user ID or job ID`);
    }

    const user = await Users.findById(userId);
    const job = await Jobs.findById(jobId);

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    if (!job) {
      console.log(`Job with ID ${jobId} not found.`);
      return res
        .status(404)
        .json({ message: `Job with ID ${jobId} not found.` });
    }

    if (job.country !== "India" && !user.isPremium) {
      console.log(
        `User with ID ${userId} is not premium and cannot apply for job ID ${jobId} outside India.`
      );
      return res.status(403).json({
        success: false,
        message: "You need to upgrade to premium to apply for this job.",
      });
    }

    if (!user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
      console.log(`User with ID ${userId} applied for job ID ${jobId}.`);

      if (!job.applicants.includes(userId)) {
        job.applicants.push(userId);
        await job.save();
        console.log(
          `Added user ID ${userId} to applicants for job ID ${jobId}.`
        );
      }

      res.status(200).json({
        success: true,
        message: "You have successfully applied for the job.",
        appliedJobs: user.appliedJobs,
      });
    } else {
      console.log(
        `User with ID ${userId} has already applied for job ID ${jobId}.`
      );
      res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
        appliedJobs: user.appliedJobs,
      });
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};