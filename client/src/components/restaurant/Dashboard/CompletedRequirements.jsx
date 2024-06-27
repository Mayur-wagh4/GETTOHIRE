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

  useEffect(() => {
    // Fetch data when component mounts
    if (restaurantId && !jobPostsFetched) {
      dispatch(fetchRestaurantJobListings({ restaurantId }));
    }
    if (restaurantId && !detailsFetched) {
      dispatch(fetchRestaurantDetails());
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
      className="container mx-auto px-4 py-8"
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
    <Card className="overflow-hidden mb-8">
      <CardHeader
        floated={false}
        className="h-80 bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <div className="flex flex-col items-center justify-center h-full text-white">
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={details.profileUrl || LogoNewImage}
            alt="Restaurant"
            className="rounded-full w-40 h-40 border-4 border-white shadow-xl mb-4"
          />
          <Typography variant="h3" className="font-bold text-shadow">
            {details?.restaurantName || details?.name}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-10">
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
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </div>
  );
}

function PostedJobsCardList({ jobPosts }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        floated={false}
        className="h-20 bg-gradient-to-r from-blue-500 to-purple-500"
      >
        <div className="flex items-center justify-center h-full">
          <Typography variant="h4" color="white" className="font-bold">
            Posted Jobs
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-10">
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
    <Card className="shadow-md">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4">
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
