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

  const renderItems = navListMenuItems.map(({ icon, title, description, path }, key) => (
    <Link to={path} key={key} onClick={() => setIsMenuOpen(false)}>
      <MenuItem className="flex items-center gap-4 py-4 pr-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-orange-800 to-pink-500 p-3 shadow-md">
          {React.createElement(icon, { strokeWidth: 2, className: 'h-6 w-6 text-white' })}
        </div>
        <div>
          <Typography variant="h6" className="text-base font-bold text-gray-800 dark:text-white">
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
          className="normal-case flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          Login / Sign Up
          <ChevronDownIcon strokeWidth={3} className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
        </Button>
      </MenuHandler>
      <MenuList className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <Typography variant="h6" color="blue-gray" className="mb-2 font-bold text-gray-900 dark:text-white">
          Choose Your Role
        </Typography>
        {renderItems}
      </MenuList>
    </Menu>
  );
}

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
    <Navbar className="sticky top-0 z-50 max-w-full w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 animate-shimmer">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img className="h-10 w-auto object-contain mr-2" src={LogoNewImage} alt="logo" />
          <Typography variant="h6" className="hidden lg:block font-semibold">
            GETTOHIRE
          </Typography>
        </Link>
        <div className="hidden lg:flex flex-grow items-center justify-center">
          {navListItems.map(({ label, route }) => (
            <Typography key={label} as="a" href={route} variant="small" className="font-medium px-4 py-2 text-white hover:text-orange-400 transition-colors duration-300">
              {label}
            </Typography>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconButton variant="text" onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden">
            <Bars2Icon className="h-6 text-white w-6" />
          </IconButton>
          {isLoggedIn ? <ProfileMenu name={candidateName} /> : <LoginMenu />}
        </div>
      </div>
      <Collapse open={isNavOpen} className="lg:hidden">
        {navListItems.map(({ label, route }) => (
          <Typography key={label} as="a" href={route} variant="small" className="font-medium block px-4 py-2 text-white hover:text-orange-400 transition-colors duration-300">
            {label}
          </Typography>
        ))}
      </Collapse>
    </Navbar>
  );
}