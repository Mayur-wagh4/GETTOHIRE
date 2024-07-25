import {
  ArrowRightOnRectangleIcon,
  Bars2Icon,
  Bars4Icon,
  ChartBarIcon,
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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogoNewImage, profile } from '../../assets/assets';
import { logoutCandidate } from '../../redux/slices/candidateSlice';

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
    path: '/admin-login',
  },
];

const navListItems = [
  { label: 'About Us', route: '/#About-us' },
  { label: 'Why Us', route: '/#why-us' },
  { label: 'Reviews', route: '/#reviews' },
  { label: 'Contact Us', route: '/#contact-us' },
  { label: 'Pricing', route: '/#pricing' },
  { label: 'Jobs', route: '/jobs' },
];

function ProfileMenu({ name }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutCandidate());
    navigate('/');
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button variant="text" className="flex items-center gap-1 rounded-full py-1.5 px-3 lg:ml-auto bg-orange-100 hover:bg-orange-200 transition-colors duration-300">
          <Avatar variant="circular" size="sm" alt={name} className="border-2 border-orange-500 p-0.5" src={profile} />
          <Typography as="span" variant="small" className="font-medium text-gray-800 hidden sm:inline">
            {name}
          </Typography>
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform text-gray-800 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 bg-white shadow-xl rounded-xl border border-orange-100">
        <MenuItem
          className="flex items-center gap-2 rounded hover:bg-orange-50 focus:bg-orange-50 active:bg-orange-50 transition-colors duration-200"
          onClick={() => navigate('/candidate')}
        >
          <ChartBarIcon className="h-4 w-4 text-orange-500" strokeWidth={2} />
          <Typography as="span" variant="small" className="font-medium text-gray-700">
            Dashboard
          </Typography>
        </MenuItem>
        <MenuItem
          className="flex items-center gap-2 rounded hover:bg-orange-50 focus:bg-orange-50 active:bg-orange-50 transition-colors duration-200"
          onClick={handleLogout}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 text-orange-500" strokeWidth={2} />
          <Typography as="span" variant="small" className="font-medium text-gray-700">
            Logout
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function LoginMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderItems = navListMenuItems.map(({ icon, title, description, path }, key) => (
    <Link to={path} key={key} onClick={() => setIsMenuOpen(false)}>
      <MenuItem className="flex items-center gap-4 py-4 pr-8 hover:bg-gray-500 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-orange-800 to-pink-500 p-3 shadow-md">
          {React.createElement(icon, { strokeWidth: 2, className: 'h-6 w-6 text-white' })}
        </div>
        <div>
          <Typography variant="h6" className="text-base font-bold text-white  ">
            {title}
          </Typography>
          <Typography variant="small" className="font-medium text-gray-500 dark:text-gray-300">
            {description}
          </Typography>
        </div>
      </MenuItem>
    </Link>
  ));

  return (
    <Menu 
      open={isMenuOpen} 
      handler={setIsMenuOpen} 
      placement="bottom-end"
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
    >
      <MenuHandler>
        <Button 
          variant="gradient" 
          className="normal-case flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 rounded-lg text-white"
        >
          Login / Sign Up
          <ChevronDownIcon strokeWidth={3} className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
        </Button>
      </MenuHandler>
      <MenuList className="p-4 mt-4 bg-gray-800 border-none rounded-xl shadow-lg   dark:bg-gray-800 ">
        <Typography variant="h6"  className="mb-3 font-bold text-white text-lg">
          Choose Your Role
        </Typography>
        {renderItems}
      </MenuList>
    </Menu>
  );
};

export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = useSelector((state) => !!state.candidate.token);
  const candidateName = useSelector((state) => state.candidate.details?.name || '');

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setIsNavOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Navbar className="sticky top-2 z-50 max-w-full w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img className="h-8 w-auto object-contain mr-2 transition-transform duration-300 group-hover:scale-105" src={LogoNewImage} alt="logo" />
          <Typography variant="h6" className="hidden sm:block font-bold text-white group-hover:text-orange-500 transition-colors duration-300">
            GETTOHIRE
          </Typography>
        </Link>
        <div className="hidden lg:flex items-center space-x-2">
          {navListItems.map(({ label, route }) => (
            <Typography
              key={label}
              as="a"
              href={route}
              variant="small"
              className="font-medium px-3 py-2 text-white hover:text-orange-500 transition-all duration-300 relative group rounded-md hover:bg-gray-800/50"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Typography>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <IconButton
            variant="text"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden text-white hover:bg-gray-700/50 transition-colors duration-300 rounded-md"
          >
            <Bars2Icon className="h-5 w-5" />
          </IconButton>
          {isLoggedIn ? <ProfileMenu name={candidateName} /> : <LoginMenu />}
        </div>
      </div>
      <Collapse open={isNavOpen} className="lg:hidden bg-gray-800/95 shadow-lg mt-2 rounded-b-xl">
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navListItems.map(({ label, route }) => (
            <Typography
              key={label}
              as="a"
              href={route}
              variant="small"
              className="font-medium block px-3 py-2 text-white hover:bg-gray-700/50 hover:text-orange-500 transition-all duration-300 rounded-md"
            >
              {label}
            </Typography>
          ))}
        </div>
      </Collapse>
    </Navbar>
  );
}