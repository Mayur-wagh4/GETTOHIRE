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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <IconButton
              color="white"
              variant="text"
              size="lg"
              onClick={toggleNav}
              className=""
            >
              {isNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h4" className="font-bold truncate">
              Restaurant Dashboard
            </Typography>
          </div>
          <Typography variant="small" className="hidden md:block truncate max-w-xs">
            Welcome, {details?.name || 'Restaurant Owner'}
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

        <main className="flex-grow p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer className="mt-auto bg-blue-gray-800 text-white py-4" />
    </div>
  );
}

export default RestaurantLayout;