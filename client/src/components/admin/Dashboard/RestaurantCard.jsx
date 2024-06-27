import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Chip, Typography } from "@material-tailwind/react";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const RestaurantCard = ({ restaurant, onDelete }) => {
  const { 
    _id,
    restaurantName, 
    restaurantCity, 
    typeOfCuisines, 
    dutyTimings, 
    foodAccommodation, 
    mobileNumber, 
    createdAt, 
    updatedAt, 
    email 
  } = restaurant;
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(prev => !prev);

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="mb-4 md:mb-0">
          <Typography variant="h5" color="blue-gray" className="font-bold mb-2">
            {restaurantName}
          </Typography>
          <Typography color="blue-gray" className="font-medium mb-1">
            {restaurantCity}
          </Typography>
          <div className="flex flex-wrap gap-2 mt-2">
            {typeOfCuisines.map((cuisine, index) => (
              <Chip key={index} value={cuisine} size="sm" variant="outlined" color="blue-gray" />
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            onClick={toggleDetails}
            className="flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" /> {showDetails ? "Hide" : "View"}
          </Button>
          <Button
            color="red"
            variant="outlined"
            size="sm"
            onClick={() => onDelete(_id)}
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left mt-4 overflow-hidden"
          >
            <DetailItem label="Duty Timings" value={dutyTimings} />
            <DetailItem label="Food Accommodation" value={foodAccommodation ? 'Yes' : 'No'} />
            <DetailItem label="Mobile Number" value={mobileNumber} />
            <DetailItem label="Created At" value={new Date(createdAt).toLocaleDateString()} />
            <DetailItem label="Updated At" value={new Date(updatedAt).toLocaleDateString()} />
            <DetailItem label="Email" value={email} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="mb-2">
    <Typography className="font-semibold text-blue-gray-600">{label}:</Typography>
    <Typography className="text-blue-gray-800">{value}</Typography>
  </div>
);

export default RestaurantCard;