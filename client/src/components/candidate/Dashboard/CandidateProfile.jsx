import {
  Card,
  CardBody,
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
    isPremium,
    createdAt,
    updatedAt
  } = details || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 lg:p-8"
    >
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20">
        <CardHeader floated={false} className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <img
              src={LogoNewImage}
              alt="profile-picture"
              className="rounded-full w-36 h-36 border-4 border-white shadow-lg"
            />
          </motion.div>
        </CardHeader>
        <CardBody className="text-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h3" color="blue-gray" className="mb-2 font-bold text-3xl">
              {name || 'N/A'}
            </Typography>
            <Typography  className="font-medium text-deep-orange-500 mb-6 text-lg">
              {position || 'N/A'} at {department || 'N/A'}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <InfoItem label="Email" value={email} />
            <InfoItem label="Contact" value={contact} />
            <InfoItem label="Aadhaar Number" value={aadhar} />
            <InfoItem label="Location" value={location} />
            <InfoItem label="Current Salary" value={currentSalary} />
            <InfoItem label="Cuisine" value={cuisine} />
            <InfoItem label="Terms Accepted" value={isTermsAccepted ? 'Yes' : 'No'} />
            <InfoItem label="Is Premium" value={isPremium ? 'Yes' : 'No'}/>
            <InfoItem label="Created At" value={new Date(createdAt).toLocaleString()} />
            <InfoItem label="Updated At" value={new Date(updatedAt).toLocaleString()} />
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}




function InfoItem({ label, value }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-md border border-gray-200">
      <Typography color="blue-gray" className="font-medium text-sm mb-1">
        {label}
      </Typography>
      <Typography color="blue-gray" className="font-bold text-lg">
        {value || 'N/A'}
      </Typography>
    </div>
  );
}

export default CandidateProfile;