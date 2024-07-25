import {
  Card,
  CardBody,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppliedJobs } from '../../../redux/slices/candidateSlice';

function AppliedJobs() {
  const dispatch = useDispatch();
  const { appliedJobs, loading, error, userId } = useSelector((state) => state.candidate);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = useCallback(() => {
    if (userId) {
      dispatch(fetchAppliedJobs(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (appliedJobs) {
      setJobs(appliedJobs);
    }
  }, [appliedJobs]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!appliedJobs || appliedJobs.length === 0) {
    return <div className="flex justify-center items-center h-screen">No applied jobs found.</div>;
  }

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
            <Typography variant="h2" color="white" className="font-bold text-3xl">
              Applied Jobs
            </Typography>
          </motion.div>
        </CardHeader>
        <CardBody className="text-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 grid grid-cols-1 gap-6"
          >
            {appliedJobs.map((job) => (
              <Card key={job._id} className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md rounded-lg border border-gray-200">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-2 font-bold text-xl">
                    {job.jobDesignation} at {job.restaurantName}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <InfoItem label="Department" value={job.jobDepartment} />
                      <InfoItem label="Job Type" value={job.jobType} />
                      <InfoItem label="Cuisine" value={job.kitchenCuisine} />
                      <InfoItem label="Salary" value={`₹${job.salary.toLocaleString()}`} />
                    </div>
                    <div>
                      <InfoItem label="Location" value={job.location} />
                      <InfoItem label="Country" value={job.country} />
                      <InfoItem label="Accommodation" value={job.accommodation === "false" ? "Not Provided" : "Provided"} />
                      <InfoItem label="Applied on" value={new Date(job.createdAt).toLocaleDateString()} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
function InfoItem({ label, value }) {
  return (
    <div className="mb-2">
      <Typography color="blue-gray" className="font-medium text-sm">
        {label}
      </Typography>
      <Typography color="blue-gray" className="font-bold text-lg">
        {value || 'N/A'}
      </Typography>
    </div>
  );
}

export default AppliedJobs;