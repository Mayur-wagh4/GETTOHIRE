import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    // dispatch(searchJobs(searchTerm));
  };
    return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mb-12"
    >
   <form onSubmit={handleSearch} className="relative flex   w-full">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for your dream job..."
          className="pr-20 py-6 text-lg placeholder-gray-400 border-2 border-blue-gray-200 focus:border-blue-500  shadow-md"
          containerProps={{
            className: "min-w-0",
          }}
          icon={<MagnifyingGlassIcon className="h-6 w-6 text-blue-gray-300" />}
        />
      </form>
    </motion.div>
  );
};

export default JobSearch;