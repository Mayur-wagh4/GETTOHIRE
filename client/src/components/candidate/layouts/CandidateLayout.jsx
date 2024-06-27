import { IconButton, Typography } from '@material-tailwind/react';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../../common/footer.jsx';
import SidebarWithBurgerMenu from './SideNav.jsx';

const CandidateLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { details, token, userId } = useSelector((state) => state.candidate);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/candidate-login');
    } 
  }, [ navigate, token,]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              color="white"
              variant="text"
              size="lg"
              onClick={toggleNav}
              className="mr-2"
            >
              {isNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h4" className="font-bold">
              My Dashboard
            </Typography>
          </div>
          <Typography variant="small" className="hidden md:block">
            Welcome, {details?.name || 'Candidate'}
          </Typography>
        </div>
      </header>

      <div className="flex flex-grow">
        <SidebarWithBurgerMenu 
          Navopen={isNavOpen} 
          onClose={() => setIsNavOpen(false)}
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        />

        <main className="flex-grow p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
}

export default CandidateLayout;
