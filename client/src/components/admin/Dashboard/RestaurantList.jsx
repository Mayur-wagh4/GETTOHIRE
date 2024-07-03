import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button, Dialog, DialogBody, DialogFooter, IconButton, Input, Spinner, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRestaurant, fetchRestaurants } from '../../../redux/slices/adminSlice';
import RestaurantCard from './RestaurantCard';

const RestaurantList = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector(state => state.admin);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    mobileNumber: '',
    restaurantCity: '',
    restaurantName: '',
    typeOfCuisines: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const restaurantsPerPage = 5;

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    if (restaurants) {
      setFilteredRestaurants(restaurants);
      filterRestaurants();
    }
  }, [restaurants, filters]);

  const filterRestaurants = () => {
    let updatedList = restaurants.filter(restaurant => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key].trim().toLowerCase();
        const restaurantValue = restaurant[key];

        if (filterValue) {
          if (typeof restaurantValue === 'string') {
            return restaurantValue.toLowerCase().includes(filterValue);
          } else if (Array.isArray(restaurantValue)) {
            return restaurantValue.some(item => item.toLowerCase().includes(filterValue));
          } else {
            return restaurantValue.toString().toLowerCase().includes(filterValue);
          }
        }
        return true;
      });
    });

    setFilteredRestaurants(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleRefresh = () => {
    dispatch(fetchRestaurants());
    setFilters({
      mobileNumber: '',
      restaurantCity: '',
      restaurantName: '',
      typeOfCuisines: '',
    });
  };

  const handleDelete = async () => {
    if (restaurantToDelete) {
      try {
        await dispatch(deleteRestaurant(restaurantToDelete)).unwrap();
        // After successful deletion, refresh the restaurant list
        dispatch(fetchRestaurants());
        setDialogOpen(false);
        setRestaurantToDelete(null);
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
        // Optionally, you can show an error message to the user here
      }
    }
  };

  const openConfirmationDialog = (restaurantId) => {
    setRestaurantToDelete(restaurantId);
    setDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setDialogOpen(false);
    setRestaurantToDelete(null);
  };

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br rounded-xl from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h2" color="blue-gray" className="font-bold">
            Restaurants
          </Typography>
          <Button
            color="blue"
            variant="gradient"
            className="flex items-center gap-2"
            onClick={handleRefresh}
          >
            <ArrowPathIcon className="h-5 w-5" /> 
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {Object.keys(filters).map((key, index) => (
            <Input
              key={index}
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              placeholder={`Filter by ${key}`}
            />
          ))}
        </div>

        {loading && !filteredRestaurants.length ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12 text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            <p>No restaurants found.</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 "
            >
              {currentRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    filters={filters}
                    onDelete={() => openConfirmationDialog(restaurant._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="flex justify-center mt-8 space-x-2">
              <IconButton
                variant="outlined"
                color="blue-gray"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              {[...Array(Math.ceil(filteredRestaurants.length / restaurantsPerPage))].map((_, index) => (
                <IconButton
                  key={index}
                  variant={currentPage === index + 1 ? "filled" : "outlined"}
                  color="blue-gray"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </IconButton>
              ))}
              <IconButton
                variant="outlined"
                color="blue-gray"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredRestaurants.length / restaurantsPerPage)}
              >
                <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} handler={setDialogOpen}>
        <DialogBody>
          <Typography className="text-blue-gray-800 font-medium">
            Are you sure you want to delete this restaurant?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            onClick={handleDelete}
            color="red"
            className="mr-1"
          >
            Yes 
          </Button>
          <Button
            variant="gradient"
            color="blue-gray"
            onClick={closeConfirmationDialog}
          >
            No
          </Button>
        </DialogFooter>
      </Dialog>
    </motion.div>
  );
};

export default RestaurantList;
