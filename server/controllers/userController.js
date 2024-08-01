import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Transactions from "../models/transactionModel.js";
import Users from "../models/userModel.js";

dotenv.config();

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

const SALT_INDEX = "1";

const createChecksum = (payload, endpoint) => {
  const string = payload + endpoint + SALT_KEY;
  return `${crypto.createHash("sha256").update(string).digest("hex")}###${SALT_INDEX}`;
};

const handleError = (res, error, message) => {
  console.error(`${message}: ${error}`);
  res.status(500).json({
    success: false,
    message: "Internal server error. Please try again later.",
    error: error.message,
  });
};

export const initiatePayment = async (req, res) => {
  try {
    const { userId, amount, number } = req.body;
    const transactionId = `T${Date.now()}`;

    const paymentData = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: `MUID${userId}`,
      amount: amount * 100,
      redirectUrl: `${PAYMENT_REDIRECT_URL}${transactionId}`,
      redirectMode: "GET",
      callbackUrl: PAYMENT_CALLBACK_URL,
      mobileNumber: number,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payload = Buffer.from(JSON.stringify(paymentData)).toString("base64");
    const checksum = createChecksum(payload, "/pg/v1/pay");

    const response = await axios.post(`${PHONEPE_BASE_URL}/pay`, 
      { request: payload },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

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

    if (transaction.userType === "Users" && transaction.status === "SUCCESS") {
      await Users.findByIdAndUpdate(transaction.userId, { isPremium: true });
    }

    res.status(200).json({ success: true, message: "Payment callback processed successfully." });
  } catch (error) {
    handleError(res, error, "Error processing payment callback");
  }
};

// Simplify the payment status check and premium update
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const url = `${PHONEPE_BASE_URL}/status/${MERCHANT_ID}/${transactionId}`;
    const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${transactionId}${SALT_KEY}`;
    const xVerify = `${crypto.createHash("sha256").update(stringToHash).digest("hex")}###${SALT_INDEX}`;

    // Fetch payment status
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-MERCHANT-ID": MERCHANT_ID,
        "X-VERIFY": xVerify,
      },
    });

    const { success, code, data } = response.data;
    const { state, responseCode, amount, transactionId: phonepeTransactionId, merchantTransactionId } = data || {};

    let redirectUrl = PAYMENT_FAILED_URL;

    if (success && state === "COMPLETED" && responseCode === "SUCCESS") {
      redirectUrl = PAYMENT_SUCCESS_URL;
    } else if (state === "PENDING") {
      redirectUrl = PAYMENT_PENDING_URL;
    }

    res.json({
      success,
      message: success ? "Payment status fetched successfully." : "Failed to fetch payment status.",
      state,
      responseCode,
      amount,
      transactionId: phonepeTransactionId,
      merchantTransactionId,
      redirectUrl,
    });

  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ success: false, message: "Error checking payment status" });
  }
};
export const updatePremiumStatus = async (req, res) => {
  try {
    // Get userId from the request body instead of req.user
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const user = await Users.findByIdAndUpdate(
      userId,
      { isPremium: true },
      { new: true, select: '_id name email isPremium' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Premium status updated successfully",
      user,
    });
  } catch (error) {
    handleError(res, error, "Error updating premium status");
  }
};

export const updateUser = async (req, res) => {
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
    user: { userId }
  } = req.body;

  try {
    if (!name || !email || !contact || !location || !department || !position || currentSalary === undefined || isAbroadStudent === undefined) {
      throw new Error("Please provide all required fields.");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findByIdAndUpdate(
      userId,
      { name, email, contact, location, department, position, cuisine, currentSalary, isAbroadStudent },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: `User not found with ID: ${userId}` });
    }

    const token = user.createJWT();

    res.status(200).json({
      success: true,
      message: "Your profile has been updated successfully.",
      user,
      token,
    });
  } catch (error) {
    handleError(res, error, "Error updating user");
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: `User not found with ID: ${userId}` });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    handleError(res, error, "Error fetching user");
  }
};

export const getCandidateAppliedJobs = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: `Invalid User ID: ${userId}` });
    }

    const user = await Users.findById(userId).populate("appliedJobs");

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found.` });
    }

    res.status(200).json(user.appliedJobs);
  } catch (error) {
    handleError(res, error, "Error fetching candidate applied jobs");
  }
};

export const getJobPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [jobs, totalJobs] = await Promise.all([
      Jobs.find().skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Jobs.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      total: totalJobs,
      jobs,
      page,
      pages: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    handleError(res, error, "Error fetching job posts");
  }
};

export const getJobById = async (req, res) => {
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

    res.status(200).json({ success: true, job });
  } catch (error) {
    handleError(res, error, "Error fetching job by ID");
  }
};

export const applyJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).send(`Invalid user ID or job ID`);
    }

    const [user, job] = await Promise.all([
      Users.findById(userId),
      Jobs.findById(jobId)
    ]);

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found.` });
    }

    if (!job) {
      return res.status(404).json({ message: `Job with ID ${jobId} not found.` });
    }

    if (job.country !== "India" && !user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "You need to upgrade to premium to apply for this job.",
      });
    }

    if (user.appliedJobs.includes(jobId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
        appliedJobs: user.appliedJobs,
      });
    }

    user.appliedJobs.push(jobId);
    job.applicants.push(userId);

    await Promise.all([user.save(), job.save()]);

    res.status(200).json({
      success: true,
      message: "You have successfully applied for the job.",
      appliedJobs: user.appliedJobs,
    });
  } catch (error) {
    handleError(res, error, "Error applying for job");
  }
};
