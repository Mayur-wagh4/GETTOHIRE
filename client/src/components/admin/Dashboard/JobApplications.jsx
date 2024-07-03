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
import { fetchJobApplications } from '../../../redux/slices/adminSlice';

const JobApplications = () => {
  const dispatch = useDispatch();
  const { jobApplications, loading, error } = useSelector((state) => state.admin);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    dispatch(fetchJobApplications());
  }, [dispatch]);

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
      className="container mx-auto p-6 rounded-xl bg-gray-100 min-h-screen"
    >
      <Typography variant="h2" className="text-4xl font-bold mb-8 text-center text-gray-800">
        Job Applications
      </Typography>
      {jobApplications.map((job, index) => (
        <Accordion
          key={job._id}
          open={openAccordion === index + 1}
          className="mb-4 rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden"
        >
          <AccordionHeader
            onClick={() => handleOpenAccordion(index + 1)}
            className="border-b-0 transition-colors hover:bg-gray-50 p-4"
          >
            <div className="flex justify-between items-center w-full">
              <div>
                <Typography variant="h5" className="text-gray-800 font-semibold">
                  {job.jobDesignation}
                </Typography>
                <Typography className="text-gray-600 text-sm">
                  {job.restaurantName} - {job.location}, {job.country}
                </Typography>
              </div>
              <Button
                size="sm"
                color={openAccordion === index + 1 ? "gray" : "blue"}
                variant="outlined"
                className="flex items-center gap-2"
              >
                {openAccordion === index + 1 ? (
                  <>
                    <span>Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </AccordionHeader>
          <AccordionBody className="bg-gray-50 p-4">
            <Card className="p-6 shadow-sm bg-white">
              <Typography variant="h6" className="text-blue-600 mb-2 font-semibold">
                Job Details
              </Typography>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Typography className="text-gray-700"><strong>Salary:</strong> ${job.salary}</Typography>
                  <Typography className="text-gray-700"><strong>Department:</strong> {job.jobDepartment}</Typography>
                </div>
                <div>
                  <Typography className="text-gray-700"><strong>Location:</strong> {job.location}, {job.country}</Typography>
                  <Typography className="text-gray-700"><strong>Type:</strong> {job.jobType}</Typography>
                </div>
              </div>
              <Typography variant="h6" className="text-blue-600 mb-4 font-semibold">
                Applicants
              </Typography>
              {job.applicants.length > 0 ? (
                <div className="space-y-4">
                  {job.applicants.map((applicant) => (
                    <Card key={applicant._id} className="p-4 shadow-sm bg-gray-50 flex items-start gap-4">
                      <Avatar
                        size="lg"
                        alt="Profile Picture"
                        src={`https://ui-avatars.com/api/?name=${applicant.name}&background=random&color=fff&bold=true`}
                      />
                      <div className="flex-grow">
                        <Typography variant="h6" className="text-gray-800 font-semibold">
                          {applicant.name}
                        </Typography>
                        <Typography className="text-gray-600 text-sm">{applicant.email} | {applicant.contact}</Typography>
                        <Typography className="text-gray-600 text-sm">
                          {applicant.position} in {applicant.department}
                        </Typography>
                        <Typography className="text-gray-600 text-sm">Current Salary: ${applicant.currentSalary}</Typography>
                      </div>
                      <Button size="sm" color="blue" variant="text">View Profile</Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Typography className="text-gray-600 italic">No applicants yet.</Typography>
              )}
            </Card>
          </AccordionBody>
        </Accordion>
      ))}
    </motion.div>
  );
};

export default JobApplications;