import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantDetails,
  updateRestaurantProfile,
} from "../../../redux/slices/restaurantSlice";

// Move formatFieldName outside of the component
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const EditProfile = () => {
  const dispatch = useDispatch();
  const { details, loading, error } = useSelector((state) => state.restaurant);
  const [newDetails, setNewDetails] = useState({});
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    setNewDetails(details);
  }, [details]);

  const handleChange = (field, value) => {
    setNewDetails({ ...newDetails, [field]: value });
  };

  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateRestaurantProfile(newDetails)).unwrap();
      const updatedDetails = await dispatch(fetchRestaurantDetails()).unwrap();
      
      // Reset states with updated data
      setNewDetails(updatedDetails);
      setEditMode({}); // Reset all edit modes
      
      // Show su      alert("Profile updated successfully!");
    } catch (error) {
      // Handle error (you can implement this as needed)
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const editableFields = [
    "restaurantName",
    "email",
    "typeOfCuisines",
    "restaurantCity",
    "dutyTimings",
    "foodAccommodation",
    "mobileNumber",
  ];

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
              src={details.profileUrl || "https://source.unsplash.com/random/200x200/?restaurant"}
              alt="Restaurant"
              className="rounded-full w-40 h-40 border-4 border-white shadow-xl mb-4"
            />
            <Typography variant="h3" className="font-bold text-shadow">
              Edit Profile
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {editableFields.map((field) => (
              <EditableField
                key={field}
                field={field}
                value={newDetails[field] || details[field]}
                isEditing={editMode[field]}
                onChange={(value) => handleChange(field, value)}
                onToggleEdit={() => toggleEditMode(field)}
              />
            ))}
          </div>
        </CardBody>
        <CardFooter className="flex justify-center pt-2">
          <Button
            color="blue"
            ripple="light"
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              "Updating..."
            ) : (
              <>
                <FaSave className="h-5 w-5" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      {error && (
        <Typography color="red" className="mt-4 text-center">
          {error}
        </Typography>
      )}
    </motion.div>
  );
};

const EditableField = ({ field, value, isEditing, onChange, onToggleEdit }) => {
  const fieldName = formatFieldName(field);

  const renderInput = () => {
    if (field === "dutyTimings") {
      return (
        <Select value={value} onChange={(val) => onChange(val)} disabled={!isEditing}>
          <Option value="8 hours">8 hours</Option>
          <Option value="10 hours">10 hours</Option>
        </Select>
      );
    } else if (field === "foodAccommodation") {
      return (
        <Select value={value} onChange={(val) => onChange(val)} disabled={!isEditing}>
          <Option value="Provided">Provided</Option>
          <Option value="Not provided">Not provided</Option>
        </Select>
      );
    } else {
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
        />
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Typography variant="small" color="blue-gray" className="font-semibold mb-2">
        {fieldName}
      </Typography>
      <div className="flex items-center">
        {renderInput()}
        <Button
          color={isEditing ? "red" : "blue"}
          buttonType="link"
          size="sm"
          rounded={true}
          iconOnly={true}
          ripple="dark"
          className="ml-2"
          onClick={onToggleEdit}
        >
          {isEditing ? <FaTimes className="h-4 w-4" /> : <FaEdit className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default EditProfile;