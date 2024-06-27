import { BriefcaseIcon, CurrencyDollarIcon, MapIcon } from '@heroicons/react/24/outline';
import { Button, Chip } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React from 'react';
const JobList = ({ jobs, handleJobClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {jobs.map(job => (
      <motion.div
        key={job._id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gray-700 rounded-xl shadow-md overflow-hidden mb-4 sm:mb-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl border border-orange-500/20"
        onClick={() => handleJobClick(job)}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">{job.jobDesignation}</h2>
            <Chip
              value={job.jobType}
              color={job.jobType === 'full-time' ? 'orange' : 'green'}
              className="rounded-full self-start sm:self-auto"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base text-gray-300">
            <div className="flex items-center">
              <MapIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
              <span>{job.location}, {job.country}</span>
            </div>
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
              <span>${job.salary}</span>
            </div>
            <div className="flex items-center">
              <BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
              <span>{job.jobDepartment}</span>
            </div>
            <div className="sm:text-right">
              <Button
                color="orange"
                size="sm"
                className="hover:scale-105 transition-transform duration-300 mt-2 sm:mt-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(job);
                }}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default JobList;
