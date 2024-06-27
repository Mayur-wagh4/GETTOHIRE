import { DialogBody, DialogHeader, Drawer, Option, Select } from '@material-tailwind/react';
import React from 'react';

const SidebarFilter = ({ isDrawerOpen, toggleDrawer, filters, handleFilterChange }) => (
  <Drawer open={isDrawerOpen} onClose={toggleDrawer} className="p-4 bg-gray-800 text-white">
    <DialogHeader className="text-orange-500">Refine Your Search</DialogHeader>
    <DialogBody>
      <div className="space-y-4">
        {['jobType', 'jobDepartment', 'cuisine', 'country'].map(filter => (
          <Select
            key={filter}
            color="orange"
            label={filter.charAt(0).toUpperCase() + filter.slice(1)}
            value={filters[filter]}
            onChange={(value) => handleFilterChange(filter, value)}
          >
            <Option value="">sdasdas</Option>
            {/* Add relevant options for each filter */}
          </Select>
        ))}
      </div>
    </DialogBody>
  </Drawer>
);

export default SidebarFilter;
