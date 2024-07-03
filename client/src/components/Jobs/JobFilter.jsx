import { Input, Option, Select } from "@material-tailwind/react";
import { motion } from "framer-motion";
import React from "react";

const JobFilter = ({ filters, onFilterChange }) => {
  const handleFilterChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-4 rounded-lg shadow-md bg-gray-800 border border-orange-500/20"
    >
      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Job Type"
          value={filters.jobType}
          onChange={(value) => handleFilterChange("jobType", value)}
          color="orange"
          className="text-white"
          labelProps={{
            className: "text-orange-500",
          }}
        >
          <Option value="" className="text-black">
            All
          </Option>
          <Option value="full-time" className="text-black">
            Full Time
          </Option>
          <Option value="part-time" className="text-black">
            Part Time
          </Option>
        </Select>
        <Select
          label="Job Department"
          value={filters.jobDepartment}
          onChange={(value) => handleFilterChange("jobDepartment", value)}
          color="orange"
          className="text-white"
          labelProps={{
            className: "text-orange-500",
          }}
        >
          <Option value="" className="text-black">
            All
          </Option>
          <Option value="Kitchen" className="text-black">
            Kitchen
          </Option>
          <Option value="F&B" className="text-black">
            F&B
          </Option>
          <Option value="Housekeeping" className="text-black">
            Housekeeping
          </Option>
          <Option value="Management" className="text-black">
            Management
          </Option>
        </Select>
        <Input
          type="text"
          label="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          color="orange"
          className="text-white"
          labelProps={{
            className: "text-orange-500",
          }}
        />
        <Select
          label="Country"
          value={filters.country}
          onChange={(value) => handleFilterChange("country", value)}
          color="orange"
          className="text-white"
          labelProps={{
            className: "text-orange-500",
          }}
        >
          <Option value="" className="text-black">
            All
          </Option>
          <Option value="India" className="text-black">
            India
          </Option>
          <Option value="Abroad" className="text-black">
            Abroad
          </Option>
        </Select>
        <Select
          label="Cuisine"
          value={filters.cuisine}
          onChange={(value) => handleFilterChange("cuisine", value)}
          color="orange"
          className="text-white"
          labelProps={{
            className: "text-orange-500",
          }}
        >
          <Option value="" className="text-black">
            All
          </Option>
          <Option value="Italian" className="text-black">
            Italian
          </Option>
          <Option value="Chinese" className="text-black">
            Chinese
          </Option>
          <Option value="Japanese" className="text-black">
            Japanese
          </Option>
          <Option value="Indian" className="text-black">
            Indian
          </Option>
          <Option value="Mexican" className="text-black">
            Mexican
          </Option>
          <Option value="Mediterranean" className="text-black">
            Mediterranean
          </Option>
          <Option value="Thai" className="text-black">
            Thai
          </Option>
          <Option value="Middle Eastern" className="text-black">
            Middle Eastern
          </Option>
          <Option value="CONTINENTAL" className="text-black">
            CONTINENTAL
          </Option>
          <Option value="TANDOOR" className="text-black">
            TANDOOR
          </Option>
          <Option value="Bakery" className="text-black">
            Bakery
          </Option>
          <Option value="SOUTH INDIAN" className="text-black">
            SOUTH INDIAN
          </Option>
        </Select>
      </div>
    </motion.div>
  );
};

export default JobFilter;
