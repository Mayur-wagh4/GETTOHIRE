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
  Card,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutRestaurant } from '../../../redux/slices/restaurantSlice';

export function SidebarWithBurgerMenu({ isOpen, onClose, restaurantName }) {
  const [accordionOpen, setAccordionOpen] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = (value) => setAccordionOpen(accordionOpen === value ? 0 : value);

  const handleLogout = () => {
    dispatch(logoutRestaurant());
    
    navigate('/restaurant-login');
  };

  const getActiveClass = (path) => 
    location.pathname === path ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "";

  const menuItems = [
    {
      id: 1,
      title: "My Dashboard",
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
      subItems: [
        { title: "Profile", path: '/restaurant', icon: <UserCircleIcon className="h-5 w-5" /> },
        { title: "Edit Details", path: '/restaurant/edit-details', icon: <Cog6ToothIcon className="h-5 w-5" /> }
      ]
    },
    {
      id: 2,
      title: "Jobs",
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      subItems: [
        { title: "Post A Job", path: '/restaurant/postjob', icon: <ShoppingBagIcon className="h-5 w-5" /> },
        { title: "Posted Jobs", path: '/restaurant/posted-jobs', icon: <ShoppingBagIcon className="h-5 w-5" /> }
      ]
    }
  ];

  return (
    <Drawer open={isOpen} onClose={onClose} className="p-0">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-[calc(100vh-2rem)] w-full rounded-none shadow-xl">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <Typography variant="h4" color="white" className="font-bold truncate">
              Hello, {restaurantName}
            </Typography>
          </div>
          <List className="p-4 overflow-y-auto">
            {menuItems.map((item) => (
              <Accordion
                key={item.id}
                open={accordionOpen === item.id}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      accordionOpen === item.id ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={accordionOpen === item.id}>
                  <AccordionHeader onClick={() => handleOpen(item.id)} className="border-b-0 p-3">
                    <ListItemPrefix>{item.icon}</ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      {item.title}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {item.subItems.map((subItem, index) => (
                      <Link key={index} to={subItem.path}>
                        <ListItem className={`p-3 ${getActiveClass(subItem.path)}`}>
                          <ListItemPrefix>{subItem.icon}</ListItemPrefix>
                          {subItem.title}
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            ))}

            <ListItem 
              className="p-3 mt-4 text-red-500 hover:bg-red-50 transition-colors" 
              onClick={handleLogout}
            >
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </motion.div>
    </Drawer>
  );
}

export default SidebarWithBurgerMenu;