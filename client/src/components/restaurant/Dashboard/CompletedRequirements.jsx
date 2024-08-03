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


function PostedJobsCardList({ jobPosts }) {
  return (
    <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20 mt-8">
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
          <div className="space-y-6">
            {jobPosts.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
    <Card className="w-full shadow-md border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardBody className="p-6">
        <Typography variant="h5" color="blue-gray" className="font-bold mb-4">
          {job.jobDesignation}
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem label="Salary" value={job.salary} />
          <InfoItem label="Location" value={job.location} />
          <InfoItem label="Job Type" value={job.jobType} />
          <InfoItem label="Department" value={job.jobDepartment} />
          <InfoItem label="Accommodation" value={job.accommodation} />
          <InfoItem label="Country" value={job.country} />
        </div>
        <Typography variant="h6" color="blue-gray" className="font-bold mt-6 mb-3">
          Candidates
        </Typography>
        {job.candidates && job.candidates.length > 0 ? (
          <div className="space-y-4">
            {job.candidates.map((candidate, index) => (
              <CandidateCard key={index} candidate={candidate} />
            ))}
          </div>
        ) : (
          <Typography color="blue-gray" className="text-center">
            No candidates applied yet.
          </Typography>
        )}
      </CardBody>
    </Card>
  );
}

function CandidateCard({ candidate }) {
  return (
    <Card className="w-full bg-gray-50 shadow-sm border border-gray-200 rounded-lg">
      <CardBody className="p-4">
        <Typography variant="h6" color="blue-gray" className="font-bold mb-2">
          {candidate.name}
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InfoItem label="Email" value={candidate.email} />
          <InfoItem label="Contact" value={candidate.contact} />
          <InfoItem label="Location" value={candidate.location} />
          <InfoItem label="Department" value={candidate.department} />
          <InfoItem label="Position" value={candidate.position} />
          <InfoItem label="Current Salary" value={candidate.currentSalary} />
        </div>
      </CardBody>
    </Card>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm border border-gray-200">
      <Typography color="blue-gray" className="font-medium text-sm mb-1">
        {label}
      </Typography>
      <Typography color="blue-gray" className="font-bold text-base">
        {value || 'N/A'}
      </Typography>
    </div>
  );
}

export default PostedJobs;