import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Typography } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import { default as React, useCallback, useEffect, useState } from 'react';
import { FaGlobeAmericas, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  checkPaymentStatus,
  createAbroadJob,
  createJob,
  fetchRestaurantDetails,
  initiateJobPostPayment,
} from '../../../redux/slices/restaurantSlice';

const FIXED_PRICE = 1; // Fixed recruitment cost
const API_BASE_URL = "http://localhost:3000/api-v1/restaurants"; // API base URL

// Options for job departments and designations
const jobDepartmentOptions = {
  Kitchen: ['Executive Chef', 'Sous Chef', 'Chef de Partie (CDP)', 'Demi Chef de Partie (DCDP)', 'Assistant Cook', 'Kitchen Helper', 'Commis 1', 'Commis 2', 'Commis 3'],
  'F&B': ['Restaurant Manager', 'Waiter', 'Waitress', 'Captain', 'Bartender', 'Sommelier', 'Food and Beverage Manager'],
  Housekeeping: ['Housekeeper', 'Housekeeping Supervisor/Manager', 'Laundry Attendant', 'Room Attendant', 'Public Area Cleaner', 'Table boy'],
  Management: ['General Manager', 'Assistant General Manager', 'Hotel Manager', 'Operations Manager']
};

// Options for kitchen cuisines
const kitchenCuisineOptions = ['Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Mediterranean', 'Thai', 'Middle Eastern', 'CONTINENTAL', 'TANDOOR', 'Bakery', 'SOUTH INDIAN'];

const PaymentStatus = {
  INITIATED: "INITIATED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  TIMEOUT: "TIMEOUT",
};

const AlertColors = {
  [PaymentStatus.INITIATED]: "blue",
  [PaymentStatus.PENDING]: "yellow",
  [PaymentStatus.COMPLETED]: "green",
  [PaymentStatus.FAILED]: "red",
  [PaymentStatus.TIMEOUT]: "orange",
};

const StatusMessages = {
  [PaymentStatus.INITIATED]: "Payment initiated. Please complete the payment on the opened page.",
  [PaymentStatus.PENDING]: "Payment is pending. Please wait while we confirm your payment.",
  [PaymentStatus.COMPLETED]: "Payment successful! You can now post your job.",
  [PaymentStatus.FAILED]: "Payment failed. Please try again or contact support.",
  [PaymentStatus.TIMEOUT]: "Payment not completed within the time limit. Please try again.",
};

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details: restaurantDetails } = useSelector((state) => state.restaurant);

  const [dialogOpen, setDialogOpen] = useState(false);
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
  const [error, setError] = useState('');
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    setIsComponentMounted(true);
    if (!restaurantDetails) {
      dispatch(fetchRestaurantDetails());
    } else {
      setFormData(prev => ({ ...prev, restaurantName: restaurantDetails.restaurantName }));
    }
  }, [dispatch, restaurantDetails]);

  const validateForm = useCallback(() => {
    const requiredFields = ['restaurantName', 'jobDesignation', 'salary', 'location', 'jobType', 'jobDepartment', 'numberOfRequirements'];
    if (isAbroad) {
      requiredFields.push('accommodation', 'country');
    }
    if (formData.jobDepartment === 'Kitchen') {
      requiredFields.push('cuisine');
    }

    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      setError(`Fill all Fields: ${emptyFields.join(', ')}`);
      return false;
    }
    return true;
  }, [formData, isAbroad]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePayment = useCallback(async () => {
    if (!validateForm()) return;

    if (!restaurantDetails) {
      setError('Restaurant details not available');
      return;
    }

    const paymentData = {
      amount: FIXED_PRICE,
      userId: restaurantDetails._id,
      name: restaurantDetails.restaurantName,
      number: restaurantDetails.contact,
    };

    try {
      const resultAction = await dispatch(initiateJobPostPayment(paymentData));
      if (initiateJobPostPayment.fulfilled.match(resultAction)) {
        setTransactionId(resultAction.payload.transactionId);
        setPaymentStatus(PaymentStatus.INITIATED);
        const paymentWindow = window.open(resultAction.payload.paymentUrl, '_blank', 'width=800,height=600');
        if (paymentWindow) {
          pollPaymentStatus(resultAction.payload.transactionId);
        } else {
          setError('Please allow pop-ups to complete the payment');
        }
      } else {
        throw new Error('Payment Failed');
      }
    } catch (error) {
      setError('Payment initiation failed. Please try again.');
      console.error(error);
    }
  }, [dispatch, restaurantDetails, validateForm]);

  const pollPaymentStatus = useCallback((transactionId) => {
    const startTime = Date.now();
    const timeoutDuration = 15 * 60 * 1000; // 15 minutes timeout

    const checkStatus = async () => {
      try {
        const resultAction = await dispatch(checkPaymentStatus(transactionId));
        if (checkPaymentStatus.fulfilled.match(resultAction)) {
          const newStatus = resultAction.payload.state;
          setPaymentStatus(newStatus);
          setPollCount((prevCount) => prevCount + 1);

          if (newStatus === PaymentStatus.COMPLETED) {
            handleJobPosting(transactionId);
            return;
          } else if (newStatus === PaymentStatus.FAILED) {
            return;
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }

      if (Date.now() - startTime >= timeoutDuration) {
        setPaymentStatus(PaymentStatus.TIMEOUT);
        setShowTimeoutDialog(true);
        return;
      }

      const timePassed = Date.now() - startTime;
      let nextInterval;

      if (pollCount < 5) {
        nextInterval = 3000; // First 15 seconds: every 3 seconds
      } else if (pollCount < 15) {
        nextInterval = 5000; // Next 50 seconds: every 5 seconds
      } else if (pollCount < 25) {
        nextInterval = 10000; // Next 100 seconds: every 10 seconds
      } else {
        nextInterval = 30000; // Remaining time: every 30 seconds
      }

      setTimeout(checkStatus, nextInterval);
    };

    // Initial check after 5 seconds
    setTimeout(checkStatus, 5000);
  }, [dispatch, pollCount]);

  const handleJobPosting = useCallback(async (transactionId) => {
    if (!validateForm()) return;

    try {
      const jobData = { ...formData, transactionId };
      await dispatch(isAbroad ? createAbroadJob(jobData) : createJob(jobData)).unwrap();
      navigate('/restaurant/posted-jobs');
    } catch (err) {
      setError(err.message || 'Failed to post job');
    }
  }, [dispatch, formData, isAbroad, navigate, validateForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (paymentStatus !== PaymentStatus.COMPLETED) {
      await handlePayment();
    } else {
      await handleJobPosting(transactionId);
    }
  }, [paymentStatus, handlePayment, handleJobPosting, transactionId]);

  const handleTimeoutDialogClose = () => {
    setShowTimeoutDialog(false);
    // dispatch(resetPayment());
    setPaymentStatus(null);
    setTransactionId(null);
  };

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;

    const alertColor = AlertColors[paymentStatus] || "gray";
    const statusMessage = StatusMessages[paymentStatus] || "Unknown payment status. Please contact support.";

    return (
      <Alert color={alertColor} className="mt-4">
        {statusMessage}
        {transactionId && (
          <Typography variant="small" className="mt-2">
            Transaction ID: {transactionId}
          </Typography>
        )}
        {[PaymentStatus.INITIATED, PaymentStatus.PENDING].includes(paymentStatus) && (
          <Typography variant="small" className="mt-2">
            Checking payment status... (Attempt {pollCount})
          </Typography>
        )}
      </Alert>
    );
  };

  if (!isComponentMounted) {
    return null; // or a loading indicator
  }

  return (
    <AnimatePresence>
      {isComponentMounted && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 lg:p-8"
        >
          <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20">
            <CardHeader floated={false} className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
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
                      color={isAbroad ? "blue-gray" : "red"}
                      onClick={() => setIsAbroad(false)}
                      className="flex items-center gap-2"
                    >
                      <FaMapMarkerAlt /> India Job
                    </Button>
                    <Button
                      color={isAbroad ? "red" : "blue-gray"}
                      onClick={() => setIsAbroad(true)}
                      className="flex items-center gap-2"
                    >
                      <FaGlobeAmericas /> Abroad Job
                    </Button>
                  </div>
                </motion.div>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
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
                </motion.div>
                <div className="mt-6">
                  <Typography variant="h6" color="blue-gray" className="font-bold">
                    Fixed Recruitment Cost: ₹{FIXED_PRICE}
                  </Typography>
                </div>
              </form>
            </CardBody>
            <CardFooter className="flex justify-center pt-2">
              <Button
                size="lg"
                className="bg-deep-orange-500 text-white"
                onClick={handleSubmit}
                disabled={[PaymentStatus.INITIATED, PaymentStatus.PENDING].includes(paymentStatus)}
              >
                {[PaymentStatus.INITIATED, PaymentStatus.PENDING].includes(paymentStatus) ? (
                  <Spinner size="sm" className="mr-2" />
                ) : paymentStatus === PaymentStatus.COMPLETED ? (
                  "Post Job"
                ) : (
                  `Pay ₹${FIXED_PRICE} & Post Job`
                )}
              </Button>
            </CardFooter>
          </Card>
          {renderPaymentStatus()}
          {error && (
            <Typography color="red" className="mt-4 text-center">
              {error}
            </Typography>
          )}
          <Dialog 
            open={showTimeoutDialog} 
            handler={handleTimeoutDialogClose}
            className="bg-white rounded-xl overflow-hidden shadow-2xl"
          >
            <DialogHeader className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
              Payment Time Limit Exceeded
            </DialogHeader>
            <DialogBody className="bg-gray-200 text-gray-800">
              The payment was not completed within the time limit. Please try again.
            </DialogBody>
            <DialogFooter className="bg-gray-200">
              <Button variant="gradient" color="deep-orange" onClick={handleTimeoutDialogClose}>
                <span>OK</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostJob;