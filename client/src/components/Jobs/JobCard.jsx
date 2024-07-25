import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  FireIcon,
  GlobeAmericasIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import React from "react";

const JobCard = ({ job, onApply }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full overflow-hidden shadow-lg transform transition duration-300 hover:scale-102 hover:shadow-xl mb-6 bg-gray-800 border border-orange-800/20">
        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Typography
              variant="h4"
              color="white"
              className="font-bold mb-2 text-2xl"
            >
              {job.jobDesignation}
            </Typography>
            <Typography variant="h6" className="mb-4 text-orange-800 text-lg">
              {job.restaurantName}
            </Typography>
          </div>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 text-white gap-4">
            <InfoItem
              icon={<MapIcon className="h-5 w-5 text-orange-800" />}
              label="Location"
              value={job.location}
            />
            <InfoItem
              icon={<GlobeAmericasIcon className="h-5 w-5 text-orange-800" />}
              label="Country"
              value={job.country}
            />
            <InfoItem
              icon={<FireIcon className="h-5 w-5 text-orange-800" />}
              label="Cuisine"
              value={job.cuisine}
            />
            <InfoItem
              icon={<BriefcaseIcon className="h-5 w-5 text-orange-800" />}
              label="Department"
              value={job.jobDepartment}
            />
            <InfoItem
              icon={<CalendarIcon className="h-5 w-5 text-orange-800" />}
              label="Job Type"
              value={job.jobType}
            />
            <InfoItem
              icon={<CurrencyRupeeIcon className="h-5 w-5 text-orange-800" />}
              label="Salary"
              value={`₹${job.salary}`}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex items-center justify-between mt-4">
            <Typography className="text-gray-400 text-sm">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </Typography>
          </div>

          <div className="col-span-1 sm:col-span-2 mt-6">
            <Button
              fullWidth
              onClick={() => onApply(job._id)}
              className="py-3 bg-orange-800 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const InfoItem = ({ icon,label = "N/A", value = "N/A"}) => (
  <div className="flex items-center space-x-2">
    {icon}
    <div>
      <Typography variant="h6" className="text-xs font-medium">
        {label}
      </Typography>
      <Typography variant="h6"  className="text-md">
        {value}
      </Typography>
    </div>
  </div>
);

export default JobCard;
