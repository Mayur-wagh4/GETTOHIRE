import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

const JobCard = ({ job, onDelete, deleteInProgress }) => {
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toggleDetails = () => {
    setShowAllDetails(!showAllDetails);
  };

  const initialDetails = [
    { label: "Department", value: job.jobDepartment },
    { label: "Job Type", value: job.jobType },
    { label: "Restaurant", value: job.restaurantName },
  ];

  const allDetails = [
    ...initialDetails,
    { label: "Cuisine", value: job.cuisine },
    { label: "Location", value: `${job.location}, ${job.country}` },
    { label: "Salary", value: `${job.salary.toLocaleString()}` },
  ];

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete(job._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="rounded-3xl shadow-2xl bg-white overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <CardBody className="text-center px-8 py-10">
          <Typography
            variant="h5"
            className="mb-4 font-bold text-blue-gray-800"
          >
            {job.restaurantName}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            {(showAllDetails ? allDetails : initialDetails).map(
              (detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="mb-2"
                >
                  <Typography className="font-semibold text-blue-gray-600 text-sm">
                    {detail.label}:
                  </Typography>
                  <Typography className="text-blue-gray-800 font-medium">
                    {detail.value}
                  </Typography>
                </motion.div>
              )
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between items-center pt-0 px-8 pb-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              color="blue"
              variant="gradient"
              onClick={toggleDetails}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              <EyeIcon className="h-5 w-5" />

              {showAllDetails ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              color="red"
              variant="gradient"
              onClick={handleDelete}
              disabled={deleteInProgress}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              <TrashIcon className="h-5 w-5" />{" "}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} handler={setShowConfirmDialog}>
        <DialogBody>
          <Typography className="text-blue-gray-800 font-medium">
            Are you sure you want to delete this job?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDelete}
            className="mr-1"
          >
            Yes
          </Button>
          <Button
            variant="gradient"
            color="blue-gray"
            onClick={() => setShowConfirmDialog(false)}
          >
            No
          </Button>
        </DialogFooter>
      </Dialog>
    </motion.div>
  );
};

export default JobCard;
