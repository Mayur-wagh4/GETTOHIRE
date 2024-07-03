import {
  ChartBarIcon,
  ChevronDownIcon,
  InboxIcon,
  PowerIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Avatar,
  Card,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoNewImage } from '../../../assets/assets';

const SidebarWithBurgerMenu = ({ Navopen, onClose }) => {
  const [accordionOpen, setAccordionOpen] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpen = (value) => {
    setAccordionOpen(accordionOpen === value ? 0 : value);
  };

  const handleLogout = () => {
    console.log("logged out");
    navigate("/admin-login");
    onClose();
  };

  const handleNavItemClick = (path) => {
    navigate(path);
    onClose();
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "tween", duration: 0.3, ease: "easeInOut" } },
    closed: {
      x: "-100%",
      transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const sections = [
    { title: "Dashboard", icon: ChartBarIcon, path: "/admin" },
    {
      title: "Candidates",
      icon: UserCircleIcon,
      accordion: 1,
      links: [{ name: "View List", path: "candidates" }],
    },
    {
      title: "Restaurants",
      icon: ShoppingBagIcon,
      accordion: 2,
      links: [
        { name: "View List", path: "/admin/restaurants" },
        { name: "Add New", path: "add-restaurants" },
      ],
    },
    {
      title: "Jobs",
      icon: ShoppingBagIcon,
      accordion: 3,
      links: [
        { name: "View Listings", path: "view-jobs" },
        { name: "Add New", path: "post-job" },
      ],
    },
    {
      title: "Applications",
      icon: PresentationChartBarIcon,
      accordion: 4,
      links: [{ name: "View Applications", path: "view-applications" }],
    },
  ];

  return (
    <AnimatePresence>
      {Navopen && (
        <Drawer open={Navopen} onClose={onClose} className="p-0 overflow-hidden bg-transparent ">
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="h-full"
          >
            <Card className="h-full w-full rounded-none bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 p-6 flex items-center space-x-4"
              >
                <Avatar
                  size="lg"
                  src={LogoNewImage}
                  alt="Admin"
                  className="border-2 object-contain bg-blue-900 border-white"
                />
                <div>
               
                  <Typography color="white" className="opacity-80 text-sm">
                    Welcome back, Admin
                  </Typography>
                </div>
              </motion.div>

              <List className="text-white px-4 space-y-2">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    {section.accordion ? (
                      <Accordion
                        open={accordionOpen === section.accordion}
                        icon={
                          <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${
                              accordionOpen === section.accordion
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        }
                      >
                        <ListItem
                          className="p-0"
                          selected={accordionOpen === section.accordion}
                        >
                          <AccordionHeader
                            onClick={() => handleOpen(section.accordion)}
                            className="border-b-0 p-3 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <ListItemPrefix>
                              <section.icon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography
                              color="white"
                              className="mr-auto font-medium"
                            >
                              {section.title}
                            </Typography>
                          </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                          <List className="p-0 ml-6">
                            {section.links.map((link, linkIndex) => (
                              <motion.div
                                key={linkIndex}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: linkIndex * 0.1 }}
                              >
                                <ListItem
                                  className={`rounded-lg transition-colors ${
                                    location.pathname === link.path
                                      ? "bg-white/20 text-white"
                                      : "hover:bg-white/10"
                                  }`}
                                  onClick={() => handleNavItemClick(link.path)}
                                >
                                  {link.name}
                                </ListItem>
                              </motion.div>
                            ))}
                          </List>
                        </AccordionBody>
                      </Accordion>
                    ) : (
                      <ListItem
                        className={`rounded-lg transition-colors ${
                          location.pathname === section.path
                            ? "bg-white/20 text-white"
                            : "hover:bg-white/10"
                        }`}
                        onClick={() => handleNavItemClick(section.path)}
                      >
                        <ListItemPrefix>
                          <section.icon className="h-5 w-5" />
                        </ListItemPrefix>
                        {section.title}
                      </ListItem>
                    )}
                  </motion.div>
                ))}

                <hr className="my-4 border-white/20" />

                <motion.div
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ListItem
                    className={`rounded-lg transition-colors ${
                      location.pathname === "/admin/notifications"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => handleNavItemClick("/admin/notifications")}
                  >
                    <ListItemPrefix>
                      <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Notifications
                  </ListItem>
                </motion.div>

                <motion.div
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ListItem
                    onClick={handleLogout}
                    className="rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ListItemPrefix>
                      <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                  </ListItem>
                </motion.div>
              </List>

              <div className="mt-auto p-4">
                <Typography
                  color="white"
                  className="text-xs opacity-70 text-center"
                >
                  © 2024 Gettohire. All rights reserved.
                </Typography>
              </div>
            </Card>
          </motion.div>
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default SidebarWithBurgerMenu;