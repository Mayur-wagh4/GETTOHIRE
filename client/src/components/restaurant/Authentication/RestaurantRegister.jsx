import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import { default as React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin } from '../../../assets/assets';
import citiesData from '../../../assets/cities.json';
import { registerRestaurant } from '../../../redux/slices/restaurantSlice';
import Footer from '../../common/footer';
import ComplexNavbar from '../../common/navbar';
import TermsAndConditions from "./TermsandConditions";

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantData: {
      city: '',
      mobileNumber: '',
    },
    acceptedTerms: false
  });

  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, token } = useSelector((state) => state.restaurant);

  const handleButtonClick = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'city' || name === 'mobileNumber') {
      setFormData({
        ...formData,
        restaurantData: {
          ...formData.restaurantData,
          [name]: newValue,
        },
      });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerRestaurant(formData));
  };

  useEffect(() => {
    if (token) {
      console.log('Registration successful, token received:', token);
      navigateTo("/restaurant"); // Navigate to restaurant dashboard on successful registration
    }
  }, [token, navigateTo]);

  useEffect(() => {
    if (error) {
      console.error('Registration failed:', error); // Log error here
      // Optionally, display error message to the user
      alert(`Registration failed: ${error.message || error}`);
    }
  }, [error]);

  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every(value =>
      typeof value !== 'object'
        ? value !== ''
        : Object.values(value).every(nestedValue =>
            typeof nestedValue !== 'object'
              ? nestedValue !== ''
              : Object.values(nestedValue).every(val => val !== '')
          )
    );
    setIsFormValid(isAllFieldsFilled && formData.acceptedTerms);
  }, [formData]);

  return (
    <>
      <ComplexNavbar />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="m-8 flex flex-col lg:flex-row items-center justify-center gap-4 shadow-lg rounded-xl bg-white"
      >
        {/* Left Half */}
        <motion.div
          className="lg:w-1/2 mt-2 flex flex-col justify-center items-center shadow-lg rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <Typography color="black" className="font-bold text-2xl mb-4">Restaurant Registration</Typography>
            <Typography variant="h1" color="black" className="text-lg font-normal">"Streamline your hiring process by finding qualified candidates quickly and efficiently with our dedicated restaurant manpower hiring portal."</Typography>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 mb-2 max-h-[50vh] w-full lg:w-4/5 overflow-y-auto">
            <RestaurantNameInput value={formData.name} onChange={handleChange} />
            <EmailInput value={formData.email} onChange={handleChange} />
            <CitySelect value={formData.restaurantData.city} onChange={handleChange} citiesData={citiesData} />
            <MobileNumberInput value={formData.restaurantData.mobileNumber} onChange={handleChange} />
            <PasswordInput value={formData.password} onChange={handleChange} />
            <ConfirmPasswordInput value={formData.confirmPassword} onChange={handleChange} />
            <Typography color="black" className="flex font-large ml-2">
              <Checkbox
                id="acceptedTerms"
                name="acceptedTerms"
                onChange={handleChange}
                className="inline"
                checked={formData.acceptedTerms}
              />
              I agree with the{' '}
              <span className="hover:text-blue-300" onClick={handleButtonClick}>
                Terms and Conditions
              </span>
            </Typography>
            {isComponentVisible && <TermsAndConditions isOpen={isComponentVisible} onClose={handleButtonClick} />}
            <Button
              className="mt-6"
              fullWidth
              type="submit"
              disabled={!isFormValid || loading}
            >
              {loading ? 'Registering...' : 'Submit'}
            </Button>
          </form>
        </motion.div>
        {/* Right Half */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full lg:w-1/2 mt-4 lg:mt-0 h-[8vh] lg:h-[80vh] flex justify-center items-center hidden lg:flex"
        >
          <img
            src={signin}
            className="h-auto lg:h-[70vh] w-full lg:w-auto object-cover rounded-3xl shadow-lg"
            alt="Pattern"
          />
        </motion.div>
      </motion.section>
      <Footer className="fixed bottom-0 w-full" />
    </>
  );
};

const RestaurantNameInput = ({ value, onChange }) => (
  <div className="mb-6">
    <Typography color="black" className="font-medium mb-2">Restaurant Name</Typography>
    <Input
      type="text"
      size="lg"
      name="name"
      placeholder="Restaurant Name"
      className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md px-4 py-2 w-full"
      value={value}
      onChange={onChange}
    />
  </div>
);

const EmailInput = ({ value, onChange }) => (
  <div className="mb-6">
    <Typography color="black" className="font-medium mb-2">Email</Typography>
    <Input
      type="email"
      size="lg"
      name="email"
      placeholder="Email"
      className="focus:outline-none focus:border-blue-500 border border-gray-300 rounded-md px-4 py-2 w-full"
      value={value}
      onChange={onChange}
    />
  </div>
);

const CitySelect = ({ value, onChange, citiesData }) => (
  <div className="mb-6">
    <Typography color="black" className="font-medium mb-2">City</Typography>
    <select
      name="city"
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-black"
    >
      <option value="">Select City</option>
      {citiesData.map(city => (
        <option key={city.id} value={city.name}>{city.name}</option>
      ))}
    </select>
  </div>
);

const MobileNumberInput = ({ value, onChange }) => (
  <div className="mb-6 flex flex-col gap-2">
    <Typography color="black" className="font-medium mb-2">Mobile Number</Typography>
    <Input
      type="text"
      size="lg"
      name="mobileNumber"
      placeholder="Mobile Number"
      className="focus:border-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);

const PasswordInput = ({ value, onChange }) => (
  <div className="mb-6 flex flex-col gap-2">
    <Typography color="black" className="font-medium mb-2">Password</Typography>
    <Input
      type="password"
      size="lg"
      name="password"
      placeholder="Password"
      className="focus:border-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);

const ConfirmPasswordInput = ({ value, onChange }) => (
  <div className="mb-6 flex flex-col gap-2">
    <Typography color="black" className="font-medium mb-2">Confirm Password</Typography>
    <Input
      type="password"
      size="lg"
      name="confirmPassword"
      placeholder="Confirm Password"
      className="focus:border-blue-500"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default RestaurantRegister;
