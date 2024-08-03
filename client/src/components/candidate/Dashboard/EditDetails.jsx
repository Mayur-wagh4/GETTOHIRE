import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import EditIcon from "@material-ui/icons/Edit";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogoNewImage } from '../../../assets/assets';
import {
  fetchCandidateDetails,
  updateCandidateProfile,
} from "../../../redux/slices/candidateSlice";

const EditDetails = () => {
  const dispatch = useDispatch();
  const { details, loading, error, userId } = useSelector((state) => state.candidate);
  const [newDetails, setNewDetails] = useState({});
  const [editMode, setEditMode] = useState({});
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    if (userId && !details) {
      dispatch(fetchCandidateDetails(userId));
    }
  }, [dispatch, userId, details]);

  useEffect(() => {
    if (details) {
      setNewDetails(details);
    }
  }, [details]);

  const handleChange = useCallback((field, value) => {
    setNewDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  }, []);

  const toggleEditMode = useCallback((field) => {
    setEditMode((prevEditMode) => ({ ...prevEditMode, [field]: !prevEditMode[field] }));
  }, []);

  const handleUpdate = useCallback(async () => {
    setUpdateStatus({ loading: true, error: null });
    try {
      await dispatch(updateCandidateProfile(newDetails)).unwrap();
      await dispatch(fetchCandidateDetails(userId)).unwrap();
      setUpdateStatus({ loading: false, error: null });
    } catch (err) {
      setUpdateStatus({ loading: false, error: err.message || 'An error occurred during update' });
    }
  }, [dispatch, newDetails, userId]);

  const formatFieldName = useCallback((fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }, []);

  const editableFields = [
    "name",
    "email",
    "contact",
    "location",
    "currentSalary",
    "cuisine",
    "department",
    "position",
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 lg:p-8"
    >
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20">
        <CardHeader floated={false} className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-full"
          >
            <img
              src={LogoNewImage}
              alt="profile-picture"
              className="rounded-full w-36 h-36 border-4 border-white shadow-lg"
            />
          </motion.div>
        </CardHeader>
        <CardBody className="text-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h3" color="blue-gray" className="mb-2 font-bold text-3xl">
              {newDetails.name || 'N/A'}
            </Typography>
            <Typography className="font-medium text-deep-orange-500 mb-6 text-lg">
              {newDetails.position || 'N/A'} 
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {editableFields.map((field) => (
              <div key={field} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-md border border-gray-200">
                <Typography color="blue-gray" className="font-medium text-sm mb-1">
                  {formatFieldName(field)}
                </Typography>
                <div className="flex items-center mt-1">
                  <input
                    type="text"
                    value={newDetails[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    readOnly={!editMode[field]}
                    className="flex-grow bg-transparent border-none focus:outline-none text-blue-gray-800 font-bold text-lg"
                  />
                  <IconButton size="sm" onClick={() => toggleEditMode(field)}>
                    <EditIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </motion.div>
        </CardBody>
        <CardFooter className="flex flex-col items-center pt-2 pb-6">
          <button
            onClick={handleUpdate}
            disabled={updateStatus.loading}
            className="bg-deep-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-deep-orange-600 transition duration-300"
          >
            {updateStatus.loading ? "Updating..." : "Update Profile"}
          </button>
          {updateStatus.error && (
            <Typography color="red" className="mt-2">
              Error: {updateStatus.error}
            </Typography>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EditDetails;