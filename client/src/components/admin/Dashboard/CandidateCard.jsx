import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography
} from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const CandidateCard = ({ candidate, onDelete, onView, deleteInProgress }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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
            {candidate.name}
          </Typography>
          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <div className="mb-2">
              <Typography className="font-semibold text-blue-gray-600">
                Department:
              </Typography>
              <Typography className="text-blue-gray-800">
                {candidate.department}
              </Typography>
            </div>
            <div className="mb-2">
              <Typography className="font-semibold text-blue-gray-600">
                Position:
              </Typography>
              <Typography className="text-blue-gray-800">
                {candidate.position}
              </Typography>
            
            </div>
            <div className="mb-2">
                  <Typography className="font-semibold text-blue-gray-600">
                    Email:
                  </Typography>
                  <Typography className="text-blue-gray-800">
                    {candidate.email}
                  </Typography>
                </div>
            {showDetails && (
              <>
              
                <div className="mb-2">
                  <Typography className="font-semibold text-blue-gray-600">
                    Contact:
                  </Typography>
                  <Typography className="text-blue-gray-800">
                    {candidate.contact}
                  </Typography>
                </div>
                <div className="mb-2">
                  <Typography className="font-semibold text-blue-gray-600">
                    Location:
                  </Typography>
                  <Typography className="text-blue-gray-800">
                    {candidate.location}
                  </Typography>
                </div>
                <div className="mb-2">
                  <Typography className="font-semibold text-blue-gray-600">
                    Cuisine:
                  </Typography>
                  <Typography className="text-blue-gray-800">
                    {candidate.cuisine}
                  </Typography>
                </div>
                <div className="mb-2">
                  <Typography className="font-semibold text-blue-gray-600">
                    Current Salary:
                  </Typography>
                  <Typography className="text-blue-gray-800">
                    {candidate.currentSalary}
                  </Typography>
                </div>
              </>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-left items-center pt-0 gap-">
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
        onClick={() => onDelete(candidate._id)}
        disabled={deleteInProgress}
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

export default CandidateCard;
