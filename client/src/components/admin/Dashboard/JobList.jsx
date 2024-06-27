import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, IconButton, Input, Option, Select, Spinner, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJob, fetchJobs } from '../../../redux/slices/adminSlice';
import JobCard from "./JobCard";

const JobsList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.admin);
  const [filters, setFilters] = useState({
    restaurantName: '',
    kitchenCuisine: '',
    jobType: '',
    jobDepartment: '',
    location: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const jobsPerPage = 5;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'location') {
          if (value === 'Abroad') {
            return job.country.toLowerCase() !== 'india';
          } else if (value === 'India') {
            return job.country.toLowerCase() === 'india';
          }
          return true;
        }
        const jobValue = job[key]?.toString().toLowerCase();
        return jobValue?.includes(value.toLowerCase());
      });
    });
  }, [jobs, filters]);

  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    dispatch(fetchJobs());
    setFilters({
      restaurantName: '',
      kitchenCuisine: '',
      jobType: '',
      jobDepartment: '',
      location: '',
    });
    setCurrentPage(1);
  };

  const handleDelete = async (jobId) => {
    setDeleteInProgress(true);
    try {
      await dispatch(deleteJob(jobId)).unwrap();
    } catch (error) {
      console.error('Failed to delete job:', error);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && !jobs.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-16 w-16 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg" role="alert">
        <Typography variant="h4" className="font-bold mb-2">Error</Typography>
        <Typography variant="body1">{error}</Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Typography variant="h1" color="blue-gray" className="font-bold text-4xl">
            Jobs List
          </Typography>
          <Button
            color="blue"
            size="lg"
            variant="gradient"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleRefresh}
          >
            <ArrowPathIcon className="h-5 w-5" /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Input
            label="Restaurant Name"
            value={filters.restaurantName}
            onChange={(e) => handleFilterChange('restaurantName', e.target.value)}
            className="shadow-sm"
          />
          <Input
            label="Cuisine"
            value={filters.kitchenCuisine}
            onChange={(e) => handleFilterChange('kitchenCuisine', e.target.value)}
            className="shadow-sm"
          />
          <Input
            label="Job Department"
            value={filters.jobDepartment}
            onChange={(e) => handleFilterChange('jobDepartment', e.target.value)}
            className="shadow-sm"
          />
          <Select
            label="Location"
            value={filters.location}
            onChange={(value) => handleFilterChange('location', value)}
            className="shadow-sm"
          >
            <Option value="">All</Option>
            <Option value="India">India</Option>
            <Option value="Abroad">Abroad</Option>
          </Select>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg shadow-md flex items-center justify-center">
            <Typography variant="h4">No jobs found.</Typography>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {currentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDelete={handleDelete}
                  deleteInProgress={deleteInProgress}
                />
              ))}
            </motion.div>
            <div className="flex justify-center mt-12 space-x-4">
              <IconButton
                variant="outlined"
                color="blue"
                size="lg"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ChevronLeftIcon strokeWidth={3} className="h-6 w-6" />
              </IconButton>
              {[...Array(Math.ceil(filteredJobs.length / jobsPerPage))].map((_, index) => (
                <IconButton
                  key={index}
                  variant={currentPage === index + 1 ? "filled" : "outlined"}
                  color="blue"
                  size="lg"
                  onClick={() => paginate(index + 1)}
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {index + 1}
                </IconButton>
              ))}
              <IconButton
                variant="outlined"
                color="blue"
                size="lg"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ChevronRightIcon strokeWidth={3} className="h-6 w-6" />
              </IconButton>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default JobsList;
