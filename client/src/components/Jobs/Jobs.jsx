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
import Spinner from "../common/Spinner";

import {
  clearError,
  fetchAppliedJobs,
  fetchJobPosts,
} from "../../redux/slices/candidateSlice";
import Footer from "../common/footer";
import ComplexNavbar from "../common/navbar";
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
    jobPosts: allJobs,
    userId,
    appliedJobs,
  } = useSelector((state) => state.candidate);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [applyTrigger, setApplyTrigger] = useState(false);

  const [filters, setFilters] = useState({
    jobType: "",
    jobDepartment: "",
    location: "",
    country: "",
    cuisine: "",
    minSalary: "",
  });
  useEffect(() => {
    dispatch(fetchJobPosts());
    if (userId) {
      dispatch(fetchAppliedJobs(userId));
    }
  }, [dispatch, userId, applyTrigger]);

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
        (!filters.jobType || job.jobType === filters.jobType) &&
        (!filters.jobDepartment ||
          job.jobDepartment === filters.jobDepartment) &&
        (!filters.location ||
          job.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.country ||
          (filters.country === "India" && job.country === "India") ||
          (filters.country === "Abroad" && job.country !== "India")) &&
        (!filters.cuisine || job.cuisine === filters.cuisine) &&
        (!filters.minSalary || job.salary >= parseInt(filters.minSalary, 10))
      );
    });
  }, [allJobs, filters, searchTerm, appliedJobs]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handlePrevPage = () =>
    currentPage > 1 && dispatch(fetchJobPosts(currentPage - 1));
  const handleNextPage = () =>
    currentPage < totalPages && dispatch(fetchJobPosts(currentPage + 1));
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  if (loading) return <Spinner />;
  if (error)
    return (
      <ErrorMessage message={error} onClose={() => dispatch(clearError())} />
    );

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
              <div className="w-full  flex gap-4">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={
                    <MagnifyingGlassIcon className="h-5 w-5 text-orange-800" />
                  }
                  className="!border !border-orange-500/20 bg-gray-700 text-white shadow-lg shadow-black/5 ring-4 ring-transparent placeholder:text-gray-400 focus:!border-orange-500 focus:!border-t-orange-500 focus:ring-orange-500/10"
                  labelProps={{ className: "hidden" }}
                />
                <Button
                  className="flex items-center bg-orange-800 justify-center h-10  capitalize"
                  onClick={openDrawer}
                >
                  <FunnelIcon strokeWidth={2} className="h-5  w-5" />
                </Button>
              </div>
            </div>
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
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </Card>
        </motion.main>
        <Footer className="mt-12 bg-gray-900 text-white py-8 border-t border-orange-500/20" />
      </div>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        className="p-4 bg-gray-800 rounded-xl "
        placement="left"
        overlayClassName="fixed  "
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5">Job Filters</Typography>
          <IconButton variant="text" onClick={closeDrawer}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <JobFilter filters={filters} onFilterChange={handleFilterChange} />
        <div className="mt-8  ml-4 flex gap-4">
          <Button size="sm" color="orange" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              handleFilterChange(filters);
              closeDrawer();
            }}
          >
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
    }, 1000);

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
    className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
  >
    <Button
      color="orange"
      variant="outlined"
      size="sm"
      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-orange-500/10 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
      onClick={onPrevPage}
      disabled={currentPage === 1}
    >
      <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
    </Button>
    <Typography
      color="white"
      className="flex items-center text-sm sm:text-base md:text-lg font-medium"
    >
      Page <span className="mx-2 text-orange-500">{currentPage}</span> of{" "}
      <span className="ml-2 text-orange-500">{totalPages}</span>
    </Typography>
    <Button
      color="orange"
      variant="gradient"
      size="sm"
      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
      onClick={onNextPage}
      disabled={currentPage === totalPages}
    >
      <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
    </Button>
  </motion.div>
);

export default Jobs;
