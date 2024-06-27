import { BriefcaseIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { Button, Card, Input, Option, Select, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAbroadJob, createJob } from '../../../redux/slices/adminSlice';
const PostJob = () => {
  const [isAbroad, setIsAbroad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    jobDesignation: '',
    salary: '',
    location: '',
    accommodation: '',
    jobType: '',
    jobDepartment: '',
    cuisine: 'Not Selected',
    country: '',
    numberOfRequirements: '',
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await dispatch(isAbroad ? createAbroadJob(formData) : createJob(formData)).unwrap();
      setIsLoading(false);
      navigate('/admin/view-applications');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred while posting the job');
    }
  };

  const jobDepartmentOptions = {
    Kitchen: [
      'Executive Chef', 'Sous Chef', 'Chef de Partie (CDP)', 'Demi Chef de Partie (DCDP)',
      'Assistant Cook', 'Kitchen Helper', 'Commis 1', 'Commis 2', 'Commis 3'
    ],
    'F&B': [
      'Restaurant Manager', 'Waiter', 'Waitress', 'Captain', 'Bartender', 'Sommelier',
      'Food and Beverage Manager'
    ],
    Housekeeping: [
      'Housekeeper', 'Housekeeping Supervisor/Manager', 'Laundry Attendant',
      'Room Attendant', 'Public Area Cleaner', 'Table boy'
    ],
    Management: [
      'General Manager', 'Assistant General Manager', 'Hotel Manager', 'Operations Manager'
    ]
  };

  const cuisineOptions = [
    'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Mediterranean',
    'Thai', 'Middle Eastern', 'CONTINENTAL', 'TANDOOR', 'Bakery', 'SOUTH INDIAN'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <Typography variant="h2" color="blue-gray" className="font-bold text-center mb-8">
          Post a New Job
        </Typography>
        <div className="flex justify-center mb-8">
          <Button
            variant={isAbroad ? "outlined" : "gradient"}
            color="blue"
            onClick={() => setIsAbroad(false)}
            className="mr-4 flex items-center"
          >
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            India Job
          </Button>
          <Button
            variant={isAbroad ? "gradient" : "outlined"}
            color="blue"
            onClick={() => setIsAbroad(true)}
            className="flex items-center"
          >
            <GlobeAltIcon className="h-5 w-5 mr-2" />
            Abroad Job
          </Button>
        </div>
        <Card className="p-8 shadow-2xl rounded-3xl bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                              />
              <Select
                label="Job Department"
                name="jobDepartment"
                value={formData.jobDepartment}
                onChange={(value) => handleSelectChange("jobDepartment", value)}
                required
              >
                {Object.keys(jobDepartmentOptions).map((dept) => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
              {formData.jobDepartment && (
                <Select
                  label="Job Designation"
                  name="jobDesignation"
                  value={formData.jobDesignation}
                  onChange={(value) => handleSelectChange("jobDesignation", value)}
                  required
                >
                  {jobDepartmentOptions[formData.jobDepartment].map((job) => (
                    <Option key={job} value={job}>{job}</Option>
                  ))}
                </Select>
              )}
              {formData.jobDepartment === "Kitchen" && (
                <Select
                  label="Kitchen Cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={(value) => handleSelectChange("cuisine", value)}
                  required
                >
                  {cuisineOptions.map((cuisine) => (
                    <Option key={cuisine} value={cuisine}>{cuisine}</Option>
                  ))}
                </Select>
              )}
              <Input
                label="Number of Requirements"
                type="number"
                name="numberOfRequirements"
                value={formData.numberOfRequirements}
                onChange={handleChange}
                required
              />
              <Input
                label="Monthly Salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
              <Input
                label="Location (City)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              {isAbroad && (
                <>
                  <Input
                    label="Accommodation"
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={(value) => handleSelectChange("jobType", value)}
                required
              >
                <Option value="full-time">Full-Time</Option>
                <Option value="part-time">Part-Time</Option>
              </Select>
            </div>
            {error && (
              <Typography color="red" className="mt-2 text-center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              className="mt-6 w-full py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              color="blue"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default PostJob;