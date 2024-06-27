import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import React, { useState } from 'react';

const JobDetailsAndApplyModal = ({ job, onClose, onApply }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onApply(job); // Pass the job object to the parent handler
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={!!job} handler={onClose} size="lg" className="bg-gray-800 text-white">
      <DialogHeader className="text-orange-500">{job.jobDesignation} at {job.restaurantName}</DialogHeader>
      <DialogBody divider className="h-[40rem] overflow-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <p><strong className="text-orange-500">Location:</strong> {job.location}, {job.country}</p>
            <p><strong className="text-orange-500">Salary:</strong> ${job.salary}</p>
            <p><strong className="text-orange-500">Job Type:</strong> {job.jobType}</p>
            <p><strong className="text-orange-500">Department:</strong> {job.jobDepartment}</p>
            <p><strong className="text-orange-500">Cuisine:</strong> {job.cuisine}</p>
            <p><strong className="text-orange-500">Posted on:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required className="..." />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="..." />
          <input type="file" name="resume" onChange={handleInputChange} required className="..." />
          <button type="submit" className="...">Apply Now</button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default JobDetailsAndApplyModal;
