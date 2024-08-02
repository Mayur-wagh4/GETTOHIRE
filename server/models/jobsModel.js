import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true },
    jobDesignation: { type: String, required: true },
    salary: { type: Number, required: true },
    location: { type: String, required: true },
    accommodation: { type: String, required: false },
    jobType: { type: String, enum: ['full-time', 'part-time'], required: false },
    jobDepartment: { type: String, required: false }, 
    kitchenCuisine: { type: String, required: false }, 
    cuisine: { type: String, required: false },

    country: { type: String, required: false },
    applicants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: false
    }],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: false
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transactions',
      required: false
    },
  },
  { timestamps: true }
);

jobSchema.pre('save', function (next) {
  this.recruitmentCost = this.salary * 0.05;
  next();
});

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
