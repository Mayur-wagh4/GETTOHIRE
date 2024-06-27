import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogoNewImage } from '../../../assets/assets';
import { fetchCandidateDetails } from '../../../redux/slices/candidateSlice';


function CandidateProfile() {
  const dispatch = useDispatch();
  const { details, loading, error, userId } = useSelector((state) => state.candidate);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCandidateDetails(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  const {
    name,
    email,
    aadhar,
    contact,
    location,
    department,
    position,
    cuisine,
    currentSalary,
    isTermsAccepted,
    isAbroadStudent,
    ispremium,
    createdAt,
    updatedAt
  } = details || {};
  console.log(details);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4"
    >
      <Card className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader floated={false} className="h-56 bg-blue-500">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <img
              src={LogoNewImage}
              alt="profile-picture"
              className="rounded-full w-32 h-31 border-4 border-white shadow-lg"
            />
          </motion.div>
        </CardHeader>
        <CardBody className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h3" color="blue-gray" className="mb-2 font-bold">
              {name || 'N/A'}
            </Typography>
            <Typography color="blue" className="font-medium mb-4">
              {position || 'N/A'} at {department || 'N/A'}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <InfoItem label="Email" value={email} />
            <InfoItem label="Contact" value={contact} />
            <InfoItem label="Aadhaar Number" value={aadhar} />
            <InfoItem label="Location" value={location} />
            <InfoItem label="Current Salary" value={currentSalary} />
            <InfoItem label="Cuisine" value={cuisine} />
            <InfoItem label="Terms Accepted" value={isTermsAccepted ? 'Yes' : 'No'} />
            <InfoItem label="Is Premium" value={ispremium ? 'true' : 'false'}/>
            <InfoItem label="Created At" value={new Date(createdAt).toLocaleString()} />
            <InfoItem label="Updated At" value={new Date(updatedAt).toLocaleString()} />
          </motion.div>
        </CardBody>
        <CardFooter className="flex justify-center gap-7 pt-2">
         </CardFooter>
      </Card>
    </motion.div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <Typography color="blue-gray" className="font-medium">
        {label}
      </Typography>
      <Typography color="blue-gray" className="font-bold">
        {value || 'N/A'}
      </Typography>
    </div>
  );
}

export default CandidateProfile;