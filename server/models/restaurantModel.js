import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const restaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    restaurantCity: {
      type: String,
      required: [true, 'Restaurant city is required'],
      trim: true,
    },
    typeOfCuisines: {
      type: [String],
    },
    dutyTimings: {
      type: String,
      enum: ['8 hours', '10 hours'],
    },
    foodAccommodation: {
      type: String,
      enum: ['Provided', 'Not provided'],
    },
    contact: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    transactions: [{
      type: Schema.Types.ObjectId,
      ref: 'Transactions'
    }],
    jobPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Jobs', // Ensure the reference name matches the model name
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to create JWT
restaurantSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Preventing OverwriteModelError
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
