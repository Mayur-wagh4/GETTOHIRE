import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  aadhar: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  cuisine: {
    type: String,
    trim: true,
  },
  currentSalary: {
    type: Number,
    required: true,
  },
  isTermsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAbroadStudent: {
    type: Boolean,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs'
  }],
}, { timestamps: true });

// Method to create JWT
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

const Users = mongoose.model("Users", userSchema);

export default Users;
