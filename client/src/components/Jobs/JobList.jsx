// JobList.jsx
import React, { useCallback, useState } from "react";

import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { applyJob } from "../../redux/slices/candidateSlice";
import JobCard from "./JobCard";

const JobList = ({ jobs }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.candidate.userId);
  const { appliedJobs } = useSelector((state) => state.candidate);
  const [errorMessage, setErrorMessage] = useState("");

  const handleApply = useCallback(
    async (jobId) => {
      try {
        const resultAction = await dispatch(applyJob({ userId, jobId }));
        if (applyJob.fulfilled.match(resultAction)) {
          setErrorMessage("Applied successfully");
          setApplyTrigger((prev) => !prev); // Toggle to trigger useEffect
        } else {
          throw new Error(resultAction.error.message);
        }
      } catch (error) {
        setErrorMessage(`Failed to apply: ${error.message}`);
      } finally {
        setTimeout(() => {
          setErrorMessage("");
        }, 1000);
      }
    },
    [dispatch, userId]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto"
    >
      <Typography variant="h4" className="mb-6 text-white font-bold">
        Available Job Listings
      </Typography>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <JobCard job={job} onApply={() => handleApply(job._id)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center bg-white shadow-xl">
          <Typography variant="h6">
            {appliedJobs.length > 0
              ? "You've applied to all available jobs matching your criteria."
              : "No jobs available matching your criteria."}
          </Typography>
          <Typography className="mt-2">
            {appliedJobs.length > 0
              ? "Check back later for new opportunities."
              : "Try adjusting your search or filter settings."}
          </Typography>
        </Card>
      )}
      {errorMessage && (
        <Typography className="mt-4 text-center text-red-500">
          {errorMessage}
        </Typography>
      )}
    </motion.div>
  );
};

export default JobList;
