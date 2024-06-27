import {
  ArrowRightOnRectangleIcon,
  Bars2Icon,
  Bars4Icon,
  ChevronDownIcon,
  SquaresPlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';
import {
  Avatar,
  Button,
  Collapse,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from '@material-tailwind/react';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogoNewImage, profile } from '../../assets/assets';
import { logoutCandidate } from '../../redux/slices/candidateSlice'; // Import your logout action

const navListMenuItems = [
  {
    title: 'Candidate',
    description: 'Find the perfect Job as per your skills.',
    icon: SquaresPlusIcon,
    path: '/candidate-login',
  },
  {
    title: 'Restaurant',
    description: 'Find the perfect solution for your needs.',
    icon: UserGroupIcon,
    path: '/restaurant-login',
  },
  {
    title: 'Admin',
    description: 'Manage functionalities of the platform.',
    icon: Bars4Icon,
    path: '/admin/admin-login',
  },
];

function ProfileMenu({ name }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    dispatch(logoutCandidate()); // Dispatch the logout action
    Navigate('/'); // Redirect to home page after logout
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button variant="text" className="flex items-center gap-1 rounded-3xl py-0.5 pr-2 pl-0.5 lg:ml-auto">
          <Avatar variant="circular" size="md" alt={name} className="border border-gray-900 p-0.5" src={profile} />
          <Typography as="span" variant="small" className="font-normal text-gray-800 mr-2">
            {name}
          </Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform text-gray-800 dark:text-gray-200 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        <MenuItem
          className="flex items-center gap-2 rounded hover:bg-rose-500/10 focus:bg-rose-500/10 active:bg-rose-500/10"
          onClick={handleLogout}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-800 dark:text-gray-800" strokeWidth={2} />
          <Typography as="span" variant="small" className="font-normal text-gray-800">
            Logout
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function LoginMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderItems = navListMenuItems.map(({ icon, title, description, path }, key) => (
    <Link to={path} key={key} onClick={() => setIsMobileMenuOpen(false)}>
      <MenuItem className="flex items-center gap-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
        <div className="flex items-center justify-center rounded-lg bg-orange-400 p-2">
          {React.createElement(icon, { strokeWidth: 2, className: 'h-6 w-6' })}
        </div>
        <div>
          <Typography variant="h6" className="flex items-center text-sm font-bold ">
            {title}
          </Typography>
          <Typography variant="paragraph" className="text-xs font-medium text-orange-400">
            {description}
          </Typography>
        </div>
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} offset={{ mainAxis: 20 }} placement="bottom" allowHover={true}>
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <div
              className="flex items-center gap-2 py-2 pr-4 font-medium cursor-pointer text-white hover:text-orange-400 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              LogIn/SignUp
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? 'rotate-180' : ''}`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${isMobileMenuOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-sm border border-orange-500/20 shadow-lg">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">{renderItems}</ul>
        </MenuList>
      </Menu>

      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>
          <div className="mt-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-sm border border-orange-500/20">
            {renderItems}
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
}

const navListItems = [
  { label: 'About Us', route: '/#About-us' },
  { label: 'Why Us', route: '/#why-us' },
  { label: 'Reviews', route: '/#reviews' },
  { label: 'Contact Us', route: '/#contact-us' },
  { label: 'Pricing ', route: '/#pricing' },
];

function NavList({ isLoggedIn }) {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, route }) => (
        <Typography key={label} variant="small" className="font-medium">
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            <a
              href={route}
              className="px-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-orange-400 dark:hover:text-orange-400"
            >
              {label}
            </a>
          </MenuItem>
        </Typography>
      ))}
      <Typography variant="small" className="font-medium text-gray-800 dark:text-gray-200">
        <MenuItem className="flex items-center gap-2 lg:rounded-full">
          {isLoggedIn ? (
            <Link to="/jobs" className="px-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-orange-400 dark:hover:text-orange-400">
              Jobs
            </Link>
          ) : (
            <Tooltip title="Please login first">
              <span className="cursor-not-allowed px-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-orange-400 dark:hover:text-orange-400">
                Jobs
              </span>
            </Tooltip>
          )}
        </MenuItem>
      </Typography>
    </ul>
  );
}

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = useSelector((state) => !!state.candidate.token);
  const candidateName = useSelector((state) => state.candidate.details?.name || '');

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setIsNavOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
<Navbar className="sticky top-0 z-50 max-w-full w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 animate-shimmer">
<div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="h-10 w-auto object-contain mr-2" src={LogoNewImage} alt="logo" />
          <Typography variant="h6" className="hidden lg:block font-semibold">
            GETTOHIRE
          </Typography>
        </Link>
        <div className="hidden lg:block flex-grow">
          <NavList isLoggedIn={isLoggedIn} />
        </div>
        <div className="flex items-center gap-2">
          <IconButton variant="text" onClick={toggleIsNavOpen} className="lg:hidden">
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          {isLoggedIn ? <ProfileMenu name={candidateName} /> : <LoginMenu />}
        </div>
      </div>
      <Collapse open={isNavOpen} className="lg:hidden">
        <NavList isLoggedIn={isLoggedIn} />
      </Collapse>
    </Navbar>
  );
}
