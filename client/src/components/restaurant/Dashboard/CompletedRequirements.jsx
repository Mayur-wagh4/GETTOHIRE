import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogoNewImage } from '../../../assets/assets';
import { fetchRestaurantDetails, fetchRestaurantJobListings } from '../../../redux/slices/restaurantSlice';

function PostedJobs() {
  const dispatch = useDispatch();
  const { jobPosts, loading, error, restaurantId, details, jobPostsFetched, detailsFetched } = useSelector((state) => state.restaurant);

  useEffect(() => {
    if (restaurantId && !jobPostsFetched) {
      dispatch(fetchRestaurantJobListings({ restaurantId }));
    }
    if (restaurantId && !detailsFetched) {
      dispatch(fetchRestaurantDetails());
    }
  }, [dispatch, restaurantId, jobPostsFetched, detailsFetched]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 lg:p-8"
    >
      <RestaurantCard details={details} />
      <PostedJobsCardList jobPosts={jobPosts} />
    </motion.div>
  );
}

function LoadingScreen() {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}

function ErrorScreen({ error }) {
  return (
    <Typography color="red" className="text-center mt-8">
      Error: {error}
    </Typography>
  );
}

function RestaurantCard({ details }) {
  return (
    <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20 mb-8">
      <CardHeader
        floated={false}
        className="h-80 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-full"
        >
          <img
            src={details.profileUrl || LogoNewImage}
            alt="Restaurant"
            className="rounded-full w-40 h-40 border-4 border-white shadow-lg mb-4"
          />
          <Typography variant="h3" color="white" className="font-bold">
            {details?.restaurantName || details?.name || 'N/A'}
          </Typography>
        </motion.div>
      </CardHeader>
      <CardBody className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Email" value={details?.email} />
          <InfoItem label="Mobile" value={details?.mobileNumber} />
        </div>
      </CardBody>
    </Card>
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

function PostedJobsCardList({ jobPosts }) {
  return (
    <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20">
      <CardHeader
        floated={false}
        className="h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      >
        <div className="flex items-center justify-center h-full">
          <Typography variant="h4" color="white" className="font-bold">
            Posted Jobs
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-8">
        {jobPosts && jobPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobPosts.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full"
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Typography color="blue-gray" className="text-center">
            No jobs posted yet.
          </Typography>
        )}
      </CardBody>
    </Card>
  );
}

function JobCard({ job }) {
  return (
    <Card className="shadow-md border border-gray-200 rounded-lg">
      <CardBody className="p-4">
        <Typography variant="h5" color="blue-gray" className="font-bold mb-4">
          {job.jobDesignation}
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Salary" value={job.salary} />
          <InfoItem label="Location" value={job.location} />
          <div className="space-y-2 sm:col-span-2">
            <InfoItem label="Accommodation" value={job.accommodation} />
            <InfoItem label="Job Type" value={job.jobType} />
            <InfoItem label="Department" value={job.jobDepartment} />
          </div>
          <div className="space-y-2 lg:col-span-3">
            <InfoItem label="Country" value={job.country} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default PostedJobs;
