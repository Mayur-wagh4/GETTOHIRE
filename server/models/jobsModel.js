import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true },
    jobDesignation: { type: String, required: true },
    salary: { type: Number, required: true },
    location: { type: String, required: true },
    accommodation: { type: String  },
    jobType: { type: String, enum: ['full-time', 'part-time'], required: true },
    jobDepartment: { type: String, required: true }, // New field for job department
    kitchenCuisine: { type: String }, // New field for kitchen cuisine
    cuisine: {
      type: String,
      enum: [
        'Italian',
        'Chinese',
        'Japanese',
        'Indian',
        'Mexican',
        'Mediterranean',
        'Thai',
        'Middle Eastern',
        'Continental',
        'Tandoor',
        'South Indian',
      ],
      required: function() {
        return this.jobDepartment === 'Kitchen';
      },
    },
    country: { type: String, required: true },
    applicants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }],
  },
  { timestamps: true }
);

// Middleware to calculate recruitment cost
jobSchema.pre('save', function (next) {
  // Calculate recruitment cost as 5% of the salary
  this.recruitmentCost = this.salary * 0.05;
  next();
});

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
