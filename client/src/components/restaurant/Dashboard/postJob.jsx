import { Button, Card, CardBody, CardFooter, CardHeader, Input, Option, Select, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaGlobeAmericas, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAbroadJob, createJob, fetchRestaurantDetails } from '../../../redux/slices/restaurantSlice';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantDetails = useSelector((state) => state.restaurant.details);
  const restaurantName = useSelector((state) => state.restaurant.Name);
  console.log(restaurantName)

  const [formData, setFormData] = useState({
    restaurantName: '',
    jobDesignation: '',
    salary: '',
    location: '',
    accommodation: '',
    jobType: '',
    jobDepartment: '',
    cuisine: '',
    country: '',
    numberOfRequirements: '',
  });

  const [isAbroad, setIsAbroad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalRecruitmentCost, setTotalRecruitmentCost] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    if (!restaurantDetails) {
      dispatch(fetchRestaurantDetails());
    }
  }, [dispatch, restaurantDetails]);

  useEffect(() => {
    if (restaurantDetails) {
      setFormData(prev => ({ ...prev, restaurantName: restaurantDetails.restaurantName}));
    }
  }, [restaurantDetails]);

  useEffect(() => {
    if (!restaurantName) {
      dispatch(fetchRestaurantDetails());
    } else {
      setFormData(prev => ({ ...prev, restaurantName }));
    }
  }, [dispatch, restaurantName]);

  useEffect(() => {
    const annualSalary = parseFloat(formData.salary) * 12;
    const recruitmentCost = annualSalary * 0.05;
    setTotalRecruitmentCost(recruitmentCost);
    setPaymentAmount(recruitmentCost * 0.25);
  }, [formData.salary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const data = {
      name: formData.restaurantName,
      amount: Math.round(paymentAmount),
      number: '9999999999',
      MUID: 'MUID' + Date.now(),
      transactionId: 'T' + Date.now(),
    };

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:3000/api-v1/payment/initiate', data);
      if (res.data?.data?.instrumentResponse?.redirectInfo?.url) {
        window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
        // Simulate a successful payment after 5 seconds
        setTimeout(() => {
          setPaymentStatus('success');
          setIsLoading(false);
        }, 5000);
      }
    } catch (error) {
      setIsLoading(false);
      setError('Payment failed. Please try again.');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)

    if (paymentStatus !== 'success') {
      await handlePayment();
    } else {
      setIsLoading(true);
      setError('');

      try {
        await dispatch(isAbroad ? createAbroadJob(formData) : createJob(formData)).unwrap();
        setIsLoading(false);
        navigate('/restaurant/posted-jobs');
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'An error occurred while posting the job');
      }
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

  const kitchenCuisineOptions = [
    'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Mediterranean',
    'Thai', 'Middle Eastern', 'CONTINENTAL', 'TANDOOR', 'Bakery', 'SOUTH INDIAN'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="overflow-hidden">
        <CardHeader
          floated={false}
          className="h-80 bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Typography variant="h3" className="font-bold text-shadow mb-4">
                Post a New Job
              </Typography>
              <div className="flex justify-center space-x-4">
                <Button
                  color={isAbroad ? "blue-gray" : "white"}
                  onClick={() => setIsAbroad(false)}
                  className="flex items-center gap-2"
                >
                  <FaMapMarkerAlt /> India Job
                </Button>
                <Button
                  color={isAbroad ? "white" : "blue-gray"}
                  onClick={() => setIsAbroad(true)}
                  className="flex items-center gap-2"
                >
                  <FaGlobeAmericas /> Abroad Job
                </Button>
              </div>
            </motion.div>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                readOnly
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
                  name="kitchenCuisine"
                  value={formData.cuisine}
                  onChange={(value) => handleSelectChange("cuisine", value)}
                  required
                >
                  {kitchenCuisineOptions.map((cuisine) => (
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
            <div className="mt-6">
              <Typography variant="h6">Total Recruitment Cost: ₹{totalRecruitmentCost.toFixed(2)}</Typography>
              <Typography variant="h6">Payment Amount (25% of Recruitment Cost): ₹{paymentAmount.toFixed(2)}</Typography>
            </div>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center pt-2">
        <Button
          size="lg"
          color="blue"
          ripple="light"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? "Processing..." : 
           paymentStatus === 'success' ? "Post Job" :
           `Pay ₹${paymentAmount.toFixed(2)} & Post Job`}
        </Button>
      </CardFooter>
      </Card>
      {error && (
        <Typography color="red" className="mt-4 text-center">
          {error}
        </Typography>
      )}
    </motion.div>
  );
};

export default PostJob;