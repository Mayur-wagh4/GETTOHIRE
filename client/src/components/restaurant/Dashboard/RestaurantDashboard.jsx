import React from 'react';
import { useSelector } from 'react-redux';

function RestaurantDashboard() {
  const { details, loading, error } = useSelector((state) => state.restaurant);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {details ? (
        <div>
          <h1>Welcome, {details.name}</h1>
          {/* Render other details */}
        </div>
      ) : (
        <div>No restaurant details available</div>
      )}
    </div>
  );
};

export default RestaurantDashboard