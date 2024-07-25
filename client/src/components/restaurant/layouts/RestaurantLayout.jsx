import { IconButton, Typography } from '@material-tailwind/react';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchRestaurantDetails } from '../../../redux/slices/restaurantSlice';
import Footer from '../../common/footer.jsx';
import SidebarWithBurgerMenu from './SideNav.jsx';

function RestaurantLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, details } = useSelector(state => state.restaurant);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/restaurant-login');
    } else {
      dispatch(fetchRestaurantDetails());
    }
  }, [dispatch, navigate, token]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="sticky top-2 z-50 max-w-full w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-orange-500/20 px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <IconButton
              color="white"
              variant="text"
              size="lg"
              onClick={toggleNav}
              className="hover:bg-gray-700"
            >
              {isNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h4" className="font-bold truncate text-white">
              My Dashboard
            </Typography>

          </div>
          <Typography variant="h6" className="hidden md:block ">
          <span className="text-white">Welcome,</span>{' '}
        <span className="text-deep-orange-500">{details?.restaurantName || 'Restaurant Owner'}</span>
      </Typography>

        </div>
      </header>

      <div className="flex flex-grow">
        <SidebarWithBurgerMenu 
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        />

        <main className="flex-grow p-4 lg:p-8 overflow-auto bg-white shadow-inner">
          <Outlet />
        </main>
      </div>

      <Footer className="mt-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4" />
    </div>
  );
}

export default RestaurantLayout;