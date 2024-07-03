import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button, Dialog, DialogBody, DialogFooter, IconButton, Input, Spinner, Typography } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCandidate, fetchCandidates } from '../../../redux/slices/adminSlice';
import CandidateCard from './CandidateCard';

const CandidateList = () => {
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector(state => state.admin);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    cuisine: '',
    department: '',
    location: ''
  });
  const candidatesPerPage = 5;

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleDelete = async () => {
    if (deleteCandidateId) {
      setDeleteInProgress(true);
      try {
        await dispatch(deleteCandidate(deleteCandidateId)).unwrap();
      } catch (error) {
        console.error('Failed to delete candidate:', error);
      } finally {
        setDeleteInProgress(false);
        setDeleteCandidateId(null);
      }
    }
  };

  const handleView = (candidateId) => {
    console.log('View candidate:', candidateId);
  };

  const handleRefresh = () => {
    dispatch(fetchCandidates());
    setFilters({
      name: '',
      cuisine: '',
      department: '',
      location: ''
    });
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCandidates.length / candidatesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const { name, department, position, email, contact, location, cuisine, currentSalary } = candidate;
    const lowerCaseSearch = searchTerm.toLowerCase();
    const { name: filterName, cuisine: filterCuisine, department: filterDepartment, location: filterLocation } = filters;

    return (
      (name.toLowerCase().includes(lowerCaseSearch) || department.toLowerCase().includes(lowerCaseSearch) ||
        position.toLowerCase().includes(lowerCaseSearch) || email.toLowerCase().includes(lowerCaseSearch) ||
        contact.toLowerCase().includes(lowerCaseSearch) || location.toLowerCase().includes(lowerCaseSearch) ||
        cuisine.toLowerCase().includes(lowerCaseSearch) || currentSalary.toLowerCase().includes(lowerCaseSearch)) &&
      (filterName === '' || name.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterCuisine === '' || cuisine.toLowerCase().includes(filterCuisine.toLowerCase())) &&
      (filterDepartment === '' || department.toLowerCase().includes(filterDepartment.toLowerCase())) &&
      (filterLocation === '' || location.toLowerCase().includes(filterLocation.toLowerCase()))
    );
  });

  const displayCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br rounded-xl  from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h2" color="blue-gray" className="font-bold">
            Candidates
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
          <Input
            type="text"
            placeholder="Filter by name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Filter by cuisine..."
            value={filters.cuisine}
            onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Filter by department..."
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        {loading && !deleteInProgress ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12 text-blue-500" />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {filteredCandidates.length === 0 && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2" />
                <p>No candidates found.</p>
              </div>
            )}

            {displayCandidates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {displayCandidates.map((candidate) => (
                  <motion.div
                    key={candidate._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CandidateCard
                      candidate={candidate}
                      onDelete={() => setDeleteCandidateId(candidate._id)}
                      onView={handleView}
                      deleteInProgress={deleteInProgress}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {filteredCandidates.length > candidatesPerPage && (
              <div className="flex justify-center mt-8 space-x-2">
                <IconButton
                  variant="outlined"
                  color="blue-gray"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
                {[...Array(Math.ceil(filteredCandidates.length / candidatesPerPage))].map((_, index) => (
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
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(filteredCandidates.length / candidatesPerPage)}
                >
                  <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
              </div>
            )}
          </>
        )}
      </div>

   
      <Dialog open={deleteCandidateId !== null} handler={() => setDeleteCandidateId(null)}>

        <DialogBody>
          <Typography className="text-blue-gray-800 font-medium">
            Are you sure you want to delete this candidate?
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

            onClick={() => setDeleteCandidateId(null)}
          >
            No
          </Button>
      
        </DialogFooter>
      </Dialog>

    </motion.div>
  );
};

export default CandidateList;
