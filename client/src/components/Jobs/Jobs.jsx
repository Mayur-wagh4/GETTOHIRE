import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyJob, fetchJobPosts } from '../../redux/slices/candidateSlice';


const Jobs = () => {
  const dispatch = useDispatch();
  const jobPosts = useSelector((state) => state.candidate.jobPosts);
  const loading = useSelector((state) => state.candidate.loading);
  const error = useSelector((state) => state.candidate.error);
  const totalJobs = useSelector((state) => state.candidate.totalJobs);
  const currentPage = useSelector((state) => state.candidate.currentPage);
  const totalPages = useSelector((state) => state.candidate.totalPages);
  const userId = useSelector((state) => state.candidate.userId);

  useEffect(() => {
    dispatch(fetchJobPosts());
  }, [dispatch]);

  const handleApply = async (jobId) => {
    try {
      const resultAction = await dispatch(applyJob({ userId, jobId }));
      if (applyJob.fulfilled.match(resultAction)) {
        alert('Application submitted successfully!');
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      alert(`Failed to apply: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Available Jobs</h1>
      <p>Total Jobs: {totalJobs} | Page {currentPage} of {totalPages}</p>
      <div>
        {jobPosts.length > 0 ? (
          jobPosts.map((job) => (
            <div key={job._id} style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3>{job.jobDesignation}</h3>
              <p><strong>Restaurant:</strong> {job.restaurantName}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ₹{job.salary}</p>
              <button 
                onClick={() => handleApply(job._id)} 
                style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p>No jobs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;