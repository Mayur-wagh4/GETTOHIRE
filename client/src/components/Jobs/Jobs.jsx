import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  Drawer,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  fetchAppliedJobs,
  fetchJobPosts,
} from "../../redux/slices/candidateSlice";
import Footer from "../common/footer";
import ComplexNavbar from "../common/navbar";
import Spinner from "../common/Spinner";
import JobFilter from "./JobFilter";
import JobList from "./JobList";

const Jobs = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    totalJobs,
    currentPage,
    totalPages,
    successMessage,
    jobPosts: allJobs,
    userId,
    appliedJobs,
  } = useSelector((state) => state.candidate);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    jobDepartment: "",
    location: "",
    country: "",
    cuisine: "",
    minSalary: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchJobPosts());
    if (userId) {
      dispatch(fetchAppliedJobs(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const searchMatch =
        job.jobDesignation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
      const notApplied = !appliedJobs.some(
        (appliedJob) => appliedJob._id === job._id
      );

      return (
        searchMatch &&
        notApplied &&
        (!filters.jobType || job.jobType === filters.jobType) &&
        (!filters.jobDepartment || job.jobDepartment === filters.jobDepartment) &&
        (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.country ||
          (filters.country === "India" && job.country === "India") ||
          (filters.country === "Abroad" && job.country !== "India")) &&
        (!filters.cuisine || job.cuisine === filters.cuisine) &&
        (!filters.minSalary || job.salary >= parseInt(filters.minSalary, 10))
      );
    });
  }, [allJobs, filters, searchTerm, appliedJobs]);

  const handlePageChange = (direction) => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchJobPosts(newPage));
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleApplyFilters = () => {
    setShowSuccessMessage(true);
    dispatch(fetchJobPosts(1)); // Fetch the first page with new filters
    setTimeout(() => {
      setShowSuccessMessage(false);
      closeDrawer();
    }, 3000); // Hide after 3 seconds
  };

  if (loading) return <Spinner />;
  
  return (
    <>
      <div>
        <ComplexNavbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 sm:py-12 md:py-16"
        >
          <Card className="p-6 sm:p-8 md:p-10 shadow-2xl rounded-3xl bg-gray-800/90 backdrop-blur-lg border border-orange-500/20">
            <Typography
              variant="h1"
              color="white"
              className="font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-8"
            >
              Discover Your Next Career Move
            </Typography>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="w-full flex gap-4">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-orange-800" />}
                  className="!border !border-orange-500/20 bg-gray-700 text-white shadow-lg shadow-black/5 ring-4 ring-transparent placeholder:text-gray-400 focus:!border-orange-500 focus:!border-t-orange-500 focus:ring-orange-500/10"
                  labelProps={{ className: "hidden" }}
                />
                <Button
                  className="flex items-center bg-orange-800 justify-center h-10 capitalize"
                  onClick={openDrawer}
                >
                  <FunnelIcon strokeWidth={2} className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {(successMessage || showSuccessMessage || error) && (
              <div className="mb-4 p-4 bg-gray-800 border border-orange-500/20 rounded-md shadow-md">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-green-600 mb-2"
                  >
                    {successMessage}
                  </motion.div>
                )}
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-green-600 mb-2"
                  >
                    Filters applied successfully!
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <JobList jobs={filteredJobs} />
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={() => handlePageChange('prev')}
              onNextPage={() => handlePageChange('next')}
            />
          </Card>
        </motion.main>
        <Footer className="mt-12 bg-gray-900 text-white py-8 border-t border-orange-500/20" />
      </div>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        className="p-4 bg-gray-800 rounded-xl"
        placement="left"
        overlayClassName="fixed"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5">Job Filters</Typography>
          <IconButton variant="text" onClick={closeDrawer}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <JobFilter filters={filters} onFilterChange={setFilters} />
        <div className="mt-8 ml-4 flex gap-4">
          <Button size="sm" color="orange" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            Apply
          </Button>
        </div>
      </Drawer>
    </>
  );
};

const ErrorMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 sm:p-8 bg-gray-800 shadow-2xl rounded-xl border border-orange-500/20">
          <Typography
            variant="h4"
            color="orange"
            className="font-bold mb-4 text-2xl sm:text-3xl md:text-4xl"
          >
            Error Occurred
          </Typography>
          <Typography color="white" className="text-base sm:text-lg">
            {message}
          </Typography>
        </Card>
      </motion.div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPrevPage, onNextPage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    className="flex justify-center mt-8"
  >
    <Button
      size="sm"
      color="orange"
      className="mr-2"
      onClick={onPrevPage}
      disabled={currentPage === 1}
    >
      <ArrowLeftIcon className="h-5 w-5" />
    </Button>
    <Typography className="flex items-center mx-2 text-white">
      Page {currentPage} of {totalPages}
    </Typography>
    <Button
      size="sm"
      color="orange"
      className="ml-2"
      onClick={onNextPage}
      disabled={currentPage === totalPages}
    >
      <ArrowRightIcon className="h-5 w-5" />
    </Button>
  </motion.div>
);

export default Jobs;
