import {
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutRestaurant } from '../../../redux/slices/restaurantSlice';

export function SidebarWithBurgerMenu({ isOpen, onClose, restaurantName }) {
  const [accordionOpen, setAccordionOpen] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details } = useSelector((state) => state.restaurant);

  const handleOpen = (value) => setAccordionOpen(accordionOpen === value ? 0 : value);

  const handleLogout = () => {
    dispatch(logoutRestaurant());
    navigate('/restaurant-login');
  };

  const closeSidenav = () => {
    onClose();
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const listItemVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: -20, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const getActiveClass = (path) => 
    location.pathname === path ? " text-white shadow-md" : "";

  const menuItems = [
    {
      id: 1,
      title: "My Dashboard",
      icon: <PresentationChartBarIcon className="h-5 text-white w-5" />,
      subItems: [
        { title: "Profile", path: '/restaurant', icon: <UserCircleIcon className="h-5 text-white w-5" /> },
        { title: "Edit Details", path: '/restaurant/edit-details', icon: <Cog6ToothIcon className="h-5 text-white w-5" /> }
      ]
    },
    {
      id: 2,
      title: "Jobs",
      icon: <ShoppingBagIcon className="h-5 text-white w-5" />,
      subItems: [
        { title: "Post A Job", path: '/restaurant/postjob', icon: <ShoppingBagIcon className="h-5 text-white w-5" /> },
        { title: "Posted Jobs", path: '/restaurant/posted-jobs', icon: <ShoppingBagIcon className="h-5 text-white w-5" /> }
      ]
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 z-50"
          >
            <Drawer open={isOpen} onClose={onClose} className="p-0">
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-full w-full shadow-xl">
                <div className="text-white p-6">
                  <Typography variant="h4" className="font-bold text-3xl mb-2">
                    Dashboard
                  </Typography>
                  <Typography variant="medium" className="hidden md:block">
                    <span className="text-white">Welcome,</span>{' '}
                    <span className="text-deep-orange-500">{details.restaurantName}</span>
                  </Typography>
                </div>

                <List className="p-4 text-white">
                  {menuItems.map((item) => (
                    <motion.div key={item.id} variants={listItemVariants}>
                      <Accordion
                        open={accordionOpen === item.id}
                        icon={
                          <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === item.id ? "rotate-180" : ""}`}
                          />
                        }
                      >
                        <ListItem className="p-0" selected={accordionOpen === item.id}>
                          <AccordionHeader onClick={() => handleOpen(item.id)} className="border-b-0 p-3 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                            <ListItemPrefix>{item.icon}</ListItemPrefix>
                            <Typography color="white" className="mr-auto font-medium">
                              {item.title}
                            </Typography>
                          </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                          <List className="p-0">
                            {item.subItems.map((subItem, index) => (
                              <Link key={index} to={subItem.path} onClick={closeSidenav}>
                                <ListItem className={`hover:bg-gray-700/50 rounded-lg transition-all duration-200 ${getActiveClass(subItem.path)}`}>
                                  <ListItemPrefix>{subItem.icon}</ListItemPrefix>
                                  <Typography color="white" className="font-medium">
                                    {subItem.title}
                                  </Typography>
                                </ListItem>
                              </Link>
                            ))}
                          </List>
                        </AccordionBody>
                      </Accordion>
                    </motion.div>
                  ))}

                  <motion.div variants={listItemVariants}>
                    <ListItem 
                      className="p-3 mt-4 hover:bg-red-50 transition-colors rounded-lg cursor-pointer" 
                      onClick={handleLogout}
                    >
                      <ListItemPrefix>
                        <PowerIcon className="h-5 text-red-500 w-5" />
                      </ListItemPrefix>
                      <Typography  className="font-medium">
                        Log Out
                      </Typography>
                    </ListItem>
                  </motion.div>
                </List>
              </div>
            </Drawer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SidebarWithBurgerMenu;
