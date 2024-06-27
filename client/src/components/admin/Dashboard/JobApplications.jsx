import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Button,
  Card,
  Typography
} from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications } from '../../../redux/slices/adminSlice'; // You'll need to create this action

const JobApplications = () => {
  const dispatch = useDispatch();
  const { jobApplications, loading, error } = useSelector((state) => state.admin);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    dispatch(fetchJobApplications());
  }, [dispatch]);
  console.log(jobApplications);

  const handleOpenAccordion = (value) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-2xl"
    >
      <Typography variant="h2" className="text-4xl font-bold mb-8 text-center text-white">
        Job Applications
      </Typography>
      {jobApplications.map((job, index) => (
        <Accordion
          key={job._id}
          open={openAccordion === index + 1}
          className="mb-4 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <AccordionHeader
            onClick={() => handleOpenAccordion(index + 1)}
            className="border-b-0 transition-colors hover:text-pink-600 px-4 py-2 flex justify-between items-center"
          >
            <Typography variant="h5" className="text-gray-700 mb-2">
              {job.jobDesignation} at {job.restaurantName}
            </Typography>
            <Button
              size="sm"
              variant="text"
              color="pink"
              className="transition-transform transform hover:scale-110 ml-auto"
            >
              {openAccordion === index + 1 ? 'Close' : 'View Details'}
            </Button>
          </AccordionHeader>
          <AccordionBody className="bg-gray-50">
            <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-gray-100">
              <Typography variant="h6" className="text-pink-600 mb-2">
                Job Details:
              </Typography>
              <Typography className="text-gray-600 mb-2">
                <strong>Salary:</strong> ${job.salary} | <strong>Location:</strong> {job.location}, {job.country}
              </Typography>
              <Typography className="text-gray-600 mb-4">
                <strong>Department:</strong> {job.jobDepartment} | <strong>Type:</strong> {job.jobType}
              </Typography>
              <Typography variant="h6" className="text-pink-600 mb-2">
                Applicants:
              </Typography>
              {job.applicants.length > 0 ? (
                job.applicants.map((applicant) => (
                  <Card key={applicant._id} className="p-4 mb-4 shadow-sm bg-white flex items-center">
                    <Avatar
                      size="lg"
                      className="mr-4"
                      alt="Profile Picture"
                      src={`https://ui-avatars.com/api/?name=${applicant.name}&background=random&color=fff&bold=true`}
                    />
                    <div>
                      <Typography variant="h6" className="text-gray-700">
                        {applicant.name}
                      </Typography>
                      <Typography className="text-gray-600">Email: {applicant.email}</Typography>
                      <Typography className="text-gray-600">Contact: {applicant.contact}</Typography>
                      <Typography className="text-gray-600">
                        Current Position: {applicant.position} in {applicant.department}
                      </Typography>
                      <Typography className="text-gray-600">Current Salary: ${applicant.currentSalary}</Typography>
                    </div>
                  </Card>
                ))
              ) : (
                <Typography className="text-gray-600">No applicants yet.</Typography>
              )}
            </Card>
          </AccordionBody>
        </Accordion>
      ))}
    </motion.div>
  );
};

export default JobApplications;
