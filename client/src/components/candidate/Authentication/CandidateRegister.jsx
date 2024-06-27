import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { signin2 } from '../../../assets/assets';
import citiesData from '../../../assets/cities.json';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { registerCandidate } from '../../../redux/slices/candidateSlice'; // Adjust the path as needed
import Footer from '../../common/footer';
import ComplexNavbar from '../../common/navbar';
import TermsAndConditions from './TermsAndConditions';

const CandidateRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.candidate);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    currentJob: '',
    currentSalary: 0,
    currentLocation: '',
    aadharNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    cuisine: '',
  });
  const [isAbroadStudent, setIsAbroadStudent] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'isAbroadStudent') {
      setIsAbroadStudent(newValue);
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const candidateData = {
      email: formData.email,
      password: formData.password,
      candidateData: {
        Name: formData.fullName,
        Mobile_Number: formData.phone,
        Department: formData.currentJob,
        Salary: formData.currentSalary,
        Location: formData.currentLocation,
        Aadhar: formData.aadharNumber,
        Cuisine: formData.cuisine,
        IsAbroadStudent: isAbroadStudent,
      },
    };

    try {
      const resultAction = await dispatch(registerCandidate(candidateData));
      if (registerCandidate.fulfilled.match(resultAction)) {
        navigate('/candidate');
      } else {
        // Handle rejection
        alert(resultAction.payload.message || 'Registration failed');
      }
    } catch (err) {
      alert('Error registering candidate: ' + err.message);
    }
  };

  const handleButtonClick = () => {
    setIsComponentVisible(!isComponentVisible);
  };


  const cuisineOptions = [
    'Italian',
    'Chinese',
    'Japanese',
    'Indian',
    'Mexican',
    'Mediterranean',
    'Thai',
    'Middle Eastern',
    'CONTINENTAL',
    'TANDOOR',
    'Bakery',
    'SOUTH INDIAN',
  ];


  return (
    <>
      <ComplexNavbar />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="m-8 flex flex-col lg:flex-row items-center justify-center gap-4 shadow-lg h-[80vh] rounded-xl p-8 bg-white"
      >
        <motion.div
          className="w-[90vw] lg:w-1/2 mt-2 flex flex-col justify-center items-center shadow-lg rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <Typography color="black" className="font-bold text-2xl mb-4">Candidate Registration</Typography>
            <Typography variant="h1" color="black" className="text-lg font-normal">
              "Discover and apply for your ideal restaurant job effortlessly on our comprehensive hiring platform tailored for the hospitality industry."
            </Typography>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-h-[60vh] overflow-y-auto">
            <CandidateNameInput formData={formData} handleChange={handleChange} />
            <ContactNumberInput formData={formData} handleChange={handleChange} />
            <DepartmentSelect formData={formData} handleChange={handleChange} />
            <CuisineSelect
              formData={formData}
              handleChange={handleChange}
              options={cuisineOptions}
            />
            <CurrentSalaryInput formData={formData} handleChange={handleChange} />
            <CurrentLocationSelect citiesData={citiesData} formData={formData} handleChange={handleChange} />
            <AadhaarNumberInput formData={formData} handleChange={handleChange} />
            <EmailInput formData={formData} handleChange={handleChange} />
            <PasswordInput formData={formData} handleChange={handleChange} />
            <ConfirmPasswordInput formData={formData} handleChange={handleChange} />
            <AbroadStudentCheckbox
            isAbroadStudent={isAbroadStudent}
            handleChange={handleChange}
          />
            
            <Typography color="black" className="flex font-large ml-2">
              <Checkbox
                id="acceptedTerms"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="inline"
              />
              I agree with the{' '}
              <span className="hover:text-blue-300" onClick={handleButtonClick}>
                Terms and Conditions
              </span>
            </Typography>
            {isComponentVisible && <TermsAndConditions isOpen={isComponentVisible} onClose={handleButtonClick} />}
            <Button
              className="mt-6" fullWidth
              type="submit"
              disabled={!formData.acceptedTerms}
            >
              Submit
            </Button>
          </form>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-full lg:w-1/2 mt-4 lg:mt-0 h-[8vh] lg:h-[80vh] flex justify-center items-center hidden lg:flex"
        >
          <img
            src={signin2}
            className="h-auto lg:h-[70vh] w-full lg:w-auto object-cover rounded-3xl shadow-lg"
            alt="Pattern"
          />
        </motion.div>
      </motion.section>
      <Footer className="fixed bottom-0 w-full" />
    </>
  );
};

const CandidateNameInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Candidate Name
    </Typography>
    <Input
      type="text"
      size="lg"
      name="fullName"
      placeholder="Candidate Name"
      className="focus:border-blue-500"
      value={formData.fullName}
      onChange={handleChange}
    />
  </div>
);
const AbroadStudentCheckbox = ({ isAbroadStudent, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="flex font-medium items-center">
      <Checkbox
        id="isAbroadStudent"
        name="isAbroadStudent"
        checked={isAbroadStudent}
        onChange={handleChange}
        className="inline mr-2"
      />
      Are you an Abroad Student?
    </Typography>
  </div>
);

const ContactNumberInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Contact Number
    </Typography>
    <Input
      type="text"
      size="lg"
      name="phone"
      placeholder="Contact Number"
      className="focus:border-blue-500"
      value={formData.phone}
      onChange={handleChange}
    />
  </div>
);
const CuisineSelect = ({ formData, handleChange, options }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Cuisine you cook
    </Typography>
    <select
      name="cuisine"
      value={formData.cuisine}
      onChange={handleChange}
      className="w-full border rounded-md px-4 py-2 border-gray focus:border-blue-500 text-black"
    >
      <option value="">Select Cuisine</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const DepartmentSelect = ({ formData, handleChange }) => (
  <div className="mb-1 flex flex-col gap-6">
    <Typography color="black" className="font-medium mb-2">
      Department
    </Typography>
    <select
      name="currentJob"
      value={formData.currentJob}
      onChange={handleChange}
      className="w-full border rounded-md px-4 py-2 border-gray focus:border-blue-500 text-black"
    >
      <option value="">Select Department</option>
      <optgroup label="Kitchen">
        <option value="Executive Chef">Executive Chef</option>
        <option value="Sous Chef">Sous Chef</option>
        <option value="Chef de Partie (CDP)">Chef de Partie (CDP)</option>
        <option value="Demi Chef de Partie (DCDP)">Demi Chef de Partie (DCDP)</option>
        <option value="Assistant Cook">Assistant Cook</option>
        <option value="Kitchen Helper">Kitchen Helper</option>
        <option value="Commis 1">Commis 1</option>
        <option value="Commis 2">Commis 2</option>
        <option value="Commis 3">Commis 3</option>
      </optgroup>
      <optgroup label="F&B">
        <option value="Restaurant Manager">Restaurant Manager</option>
        <option value="Waiter">Waiter</option>
        <option value="Waitress">Waitress</option>
        <option value="Captain">Captain</option>
        <option value="Bartender">Bartender</option>
        <option value="Sommelier">Sommelier</option>
        <option value="Food and Beverage Manager">Food and Beverage Manager</option>
      </optgroup>
      <optgroup label="Housekeeping">
        <option value="Housekeeper">Housekeeper</option>
        <option value="Housekeeping Supervisor/Manager">Housekeeping Supervisor/Manager</option>
        <option value="Laundry Attendant">Laundry Attendant</option>
        <option value="Room Attendant">Room Attendant</option>
        <option value="Public Area Cleaner">Public Area Cleaner</option>
        <option value="Table boy">Table boy</option>
      </optgroup>
      <optgroup label="Management">
        <option value="General Manager">General Manager</option>
        <option value="Assistant General Manager">Assistant General Manager</option>
        <option value="Hotel Manager">Hotel Manager</option>
        <option value="Operations Manager">Operations Manager</option>
      </optgroup>
    </select>
  </div>
);

const CurrentSalaryInput = ({ formData, handleChange }) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const handleRangeChange = (e) => {
    handleChange(e);
  };

  const calculateTrackWidth = (e) => {
    const value = e.target.value;
    const max = e.target.max;
    const min = e.target.min;
    setTrackWidth(((value - min) / (max - min)) * 100);
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor="currentSalary" className="block text-black font-medium mb-2">
        Current Salary
      </label>
      <div className="relative">
        <input
          type="range"
          id="currentSalary"
          name="currentSalary"
          value={formData.currentSalary}
          onChange={(e) => {
            handleRangeChange(e);
            calculateTrackWidth(e);
          }}
          min={8000}
          max={90000}
          step={1000}
          className="w-full h-8 rounded-lg bg-gray-300 appearance-none cursor-pointer focus:outline-none"
        />
        <div className="absolute top-0 left-0 h-2 mt-3 bg-blue-500 rounded-lg" style={{ width: `${trackWidth}%` }}></div>
      </div>
      <div className="flex justify-between text-black mt-2">
        <Typography color="gray" className="text-sm">₹8,000</Typography>
        <Typography color="gray" className="text-sm">₹90,000</Typography>
      </div>
      <Typography color="gray">Current Salary: ₹{formData.currentSalary}</Typography>
    </div>
  );
};

const CurrentLocationSelect = ({ citiesData, formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Current Location
    </Typography>
    <select
      name="currentLocation"
      value={formData.currentLocation}
      onChange={handleChange}
      required
      className="w-full border rounded-md px-4 py-2 border-gray focus:border-blue-500 text-black"
    >
      <option value="">Select Current Location</option>
      {citiesData.map(city => (
        <option key={city.id} value={city.name}>
          {city.name}
        </option>
      ))}
    </select>
  </div>
);

const AadhaarNumberInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Aadhaar Card Number
    </Typography>
    <Input
      type="text"
      size="lg"
      name="aadharNumber"
      placeholder="Aadhaar Card Number"
      className="focus:border-blue-500"
      value={formData.aadharNumber}
      onChange={handleChange}
    />
  </div>
);

const EmailInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Email
    </Typography>
    <Input
      type="email"
      size="lg"
      name="email"
      placeholder="Email"
      className="focus:border-blue-500"
      value={formData.email}
      onChange={handleChange}
    />
  </div>
);

const PasswordInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Password
    </Typography>
    <Input
      type="password"
      size="lg"
      name="password"
      placeholder="Password"
      className="focus:border-blue-500"
      value={formData.password}
      onChange={handleChange}
    />
  </div>
);

const ConfirmPasswordInput = ({ formData, handleChange }) => (
  <div className="mb-4">
    <Typography color="black" className="font-medium mb-2">
      Confirm Password
    </Typography>
    <Input
      type="password"
      size="lg"
      name="confirmPassword"
      placeholder="Confirm Password"
      className="focus:border-blue-500"
      value={formData.confirmPassword}
      onChange={handleChange}
    />
  </div>
);

export default CandidateRegister;
