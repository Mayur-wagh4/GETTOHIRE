import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardFooter, Chip, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="rounded-2xl shadow-xl bg-white overflow-hidden transition-all duration-300">
        <CardBody className="text-center px-6 py-8">
          <Typography variant="h4" className="mb-4 font-bold text-blue-gray-800">
            {restaurantName}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <div className="mb-2">
              <Typography className="font-semibold text-blue-gray-600">
                City:
              </Typography>
              <Typography className="text-blue-gray-800">
                {restaurantCity}
              </Typography>
            </div>
            <div className="mb-2">
                <Typography className="font-semibold text-blue-gray-600">
                  Email:
                </Typography>
                <Typography className="text-blue-gray-800">
                  {email}
                </Typography>
              </div>
         
            <div className="mb-2">
              <Typography className="font-semibold text-blue-gray-600">
                Mobile Number:
              </Typography>
              <Typography className="text-blue-gray-800">
                {mobileNumber}
              </Typography>
            </div>
          {showDetails && (
            <>
            <div className="mb-2">
              <Typography className="font-semibold text-blue-gray-600">
                Type of Cuisines:
              </Typography>
              <div className="flex flex-wrap gap-2">
                {typeOfCuisines.map((cuisine, index) => (
                  <Chip key={index} value={cuisine} size="sm" variant="outlined" color="blue-gray" />
                ))}
              </div>
            </div>
              <div className="mb-2">
                <Typography className="font-semibold text-blue-gray-600">
                  Duty Timings:
                </Typography>
                <Typography className="text-blue-gray-800">
                  {dutyTimings}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography className="font-semibold text-blue-gray-600">
                  Food Accommodation:
                </Typography>
                <Typography className="text-blue-gray-800">
                  {foodAccommodation ? 'Yes' : 'No'}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography className="font-semibold text-blue-gray-600">
                  Created At:
                </Typography>
                <Typography className="text-blue-gray-800">
                  {new Date(createdAt).toLocaleDateString()}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography className="font-semibold text-blue-gray-600">
                  Updated At:
                </Typography>
                <Typography className="text-blue-gray-800">
                  {new Date(updatedAt).toLocaleDateString()}
                </Typography>
              </div>
              
            </>
          )}
          </div>

        </CardBody>
        <CardFooter className="flex justify-left items-center pt-0 gap-4">
          <div className="flex flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="blue"
                variant="gradient"
                onClick={toggleDetails}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <EyeIcon className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="red"
                variant="gradient"
                onClick={() => onDelete(_id)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
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
