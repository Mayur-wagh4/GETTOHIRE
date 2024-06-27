import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

const SearchBar = ({ searchKeyword, handleSearchKeywordChange, toggleDrawer }) => (
  <div className="relative flex items-center">
    <input
      type="text"
      placeholder="Search for your dream job..."
      value={searchKeyword}
      onChange={handleSearchKeywordChange}
      className="w-full pl-10 pr-4 py-2 sm:py-4 border-2 border-orange-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-lg bg-gray-700 text-white placeholder-gray-400"
    />
    <div className="space-x-3 flex items-center ml-auto absolute right-2">
      <button
        onClick={handleSearchKeywordChange}
        className="rounded-full flex items-center text-orange-500"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
      <button
        onClick={toggleDrawer}
        className="rounded-full flex items-center text-orange-500"
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </button>
    </div>
  </div>
);

export default SearchBar;
