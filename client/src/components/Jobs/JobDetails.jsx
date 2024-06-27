import React from 'react';
import { Link, useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  // Fetch job details using the id

  return (
    <div>
      {/* Display job details */}
      <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
    </div>
  );
};

export default JobDetails;