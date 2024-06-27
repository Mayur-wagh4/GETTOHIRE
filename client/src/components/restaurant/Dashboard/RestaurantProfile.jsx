import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaCalendarAlt, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaMobileAlt, FaUtensils } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { LogoNewImage } from '../../../assets/assets';
import { fetchRestaurantDetails } from '../../../redux/slices/restaurantSlice';

function RestaurantProfile() {
  const dispatch = useDispatch();
  const { details, loading, error } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurantDetails());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!details) return <NoDataMessage />;

  const {
    restaurantName,
    email,
    createdAt,
    updatedAt,
    _id,
    restaurantCity,
    mobileNumber,
    typeOfCuisines = [],
  } = details;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="overflow-hidden">
        <CardHeader
          floated={false}
          className="h-80 bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <div className="flex flex-col items-center justify-center h-full text-white">
            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={LogoNewImage}
              alt="Restaurant"
              className="rounded-full w-40 h-40 border-4 border-white shadow-xl mb-4"
            />
            <Typography variant="h3" className="font-bold text-shadow">
              {restaurantName}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoItem icon={<FaEnvelope />} label="Email" value={email} />
            <InfoItem icon={<FaMapMarkerAlt />} label="City" value={restaurantCity} />
            <InfoItem icon={<FaMobileAlt />} label="Mobile" value={mobileNumber} />
            <InfoItem icon={<FaUtensils />} label="Cuisines" value={typeOfCuisines.join(", ")} />
            <InfoItem icon={<FaCalendarAlt />} label="Joined" value={formatDate(createdAt)} />
            <InfoItem icon={<FaIdCard />} label="ID" value={_id} />
          </div>
        
        </CardBody>
      </Card>
    </motion.div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center space-x-4"
  >
    <div className="text-blue-500 text-xl">{icon}</div>
    <div>
      <Typography variant="small" color="blue-gray" className="font-semibold">
        {label}
      </Typography>
      <Typography>{value || 'N/A'}</Typography>
    </div>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 p-4">
    <Typography variant="h5">Error: {message}</Typography>
  </div>
);

const NoDataMessage = () => (
  <div className="text-center p-4">
    <Typography variant="h5">No details available</Typography>
  </div>
);

export default RestaurantProfile;