import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  Bars2Icon as HeroMenuIcon,
  MoonIcon,
  SunIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";
import { Avatar, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { LogoNewImage } from "../../../assets/assets.js";
import { fetchCandidates, fetchJobApplications, fetchJobs, fetchRestaurants } from '../../../redux/slices/adminSlice';
import Footer from '../../common/footer.jsx';
import SidebarWithBurgerMenu from './SideNav.jsx';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { candidates, restaurants, jobApplications, jobs } = useSelector((state) => state.admin);

  // Toggle navigation bar
  const handleNavToggle = useCallback(() => setIsNavOpen(!isNavOpen), [isNavOpen]);

  // Toggle dark mode
  const handleDarkModeToggle = useCallback(() => setIsDarkMode(!isDarkMode), [isDarkMode]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchRestaurants());
    dispatch(fetchJobApplications());
    dispatch(fetchJobs());
  }, [dispatch]);

  // Memoized metric card component
  const MetricCard = React.memo(({ title, value, icon: Icon, color }) => (
    <motion.div
      className={`bg-white shadow-lg rounded-xl p-6 flex items-center ${color}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon className="h-12 w-12 mr-4" />
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </motion.div>
  ));

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} transition-colors duration-300`}>
      {/* Sidebar with burger menu */}
      <SidebarWithBurgerMenu Navopen={isNavOpen} onClose={() => setIsNavOpen(false)} isDarkMode={isDarkMode} />

      <div className={`p-4 sm:p-6 ${isNavOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg mb-8`}
        >
          <div className="flex items-center">
            <IconButton
              variant="text"
              color={isDarkMode ? "white" : "blue-gray"}
              className="mr-4 hover:bg-opacity-20 transition-all duration-300"
              onClick={handleNavToggle}
            >
              <HeroMenuIcon className="h-6 w-6" />
            </IconButton>
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Typography variant='h4' color="white" className="font-bold">
                  A
                </Typography>
              </div>
              <Typography variant='h4' color={isDarkMode ? "white" : "blue-gray"} className="font-bold">
                Admin Dashboard
              </Typography>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Tooltip content="Toggle Dark Mode">
              <IconButton variant="text" color={isDarkMode ? "white" : "blue-gray"} onClick={handleDarkModeToggle} className="hover:bg-opacity-20 transition-all duration-300">
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </IconButton>
            </Tooltip>
            <div className="flex items-center space-x-3">
              <Avatar
                size="md"
                variant="circular"
                alt="Admin User"
                className={`border-2 object-contain ${isDarkMode ? 'bg-gray-900' : ' bg-gradient-to-r from-blue-500 to-purple-500'}   border-deep-orange-500 p-0.5`}
                src={LogoNewImage}
              />
            </div>
          </div>
        </motion.header>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Candidates" value={candidates.length} icon={UserGroupIcon} color="text-green-600" />
          <MetricCard title="Active Jobs" value={jobs.length} icon={BriefcaseIcon} color="text-blue-600" />
          <MetricCard title="Recent Applications" value={jobApplications.length} icon={DocumentCheckIcon} color="text-yellow-600" />
          <MetricCard title="Restaurants" value={restaurants.length} icon={BuildingOfficeIcon} color="text-red-600" />
        </div>

        {/* Content Outlet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8`}
        >
          <Outlet />
        </motion.div>

        {/* Footer Section */}
        <Footer isDarkMode={isDarkMode} />
      </div>

      {/* Settings Button Section */}
      
    </div>
  );
};

export default AdminLayout;
