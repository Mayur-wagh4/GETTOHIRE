import {
  ChevronDownIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
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
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Drawer,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutCandidate } from "../../../redux/slices/candidateSlice";

export function SidebarWithBurgerMenu({ Navopen, onClose }) {
  const [accordionOpen, setAccordionOpen] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { details } = useSelector((state) => state.candidate);

  const handleOpen = (value) => setAccordionOpen(accordionOpen === value ? 0 : value);
  const handleLogout = () => {
    dispatch(logoutCandidate());
    navigate('/candidate-login');
  };
  const handleUpgrade = () => setOpenModal(true);
  const handlePayment = () => {
    setOpenModal(false);
    navigate('/candidate/payment');
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const listItemVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: -20, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <AnimatePresence>
        {Navopen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 z-50"
          >
            <Drawer open={Navopen} onClose={onClose} className="p-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 h-full w-full shadow-xl">
                <div className="text-white p-6">
                  <Typography variant="h4" className="font-bold text-3xl mb-2">
                    Dashboard
                  </Typography>
                  <Typography variant="h6" className="text-blue-200">
                    Welcome, {details.name || 'User'}
                  </Typography>
                </div>

                <List className="p-4 text-white">
                  <motion.div variants={listItemVariants}>
                    <Accordion
                      open={accordionOpen === 1}
                      icon={
                        <ChevronDownIcon
                          strokeWidth={2.5}
                          className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
                        />
                      }
                    >
                      <ListItem className="p-0" selected={accordionOpen === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3 hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                          <ListItemPrefix>
                            <PresentationChartBarIcon className="h-5 w-5" />
                          </ListItemPrefix>
                          <Typography color="white" className="mr-auto font-medium">
                            My Dashboard
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0">
                          <Link to='/candidate'>
                            <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                              <ListItemPrefix>
                                <UserCircleIcon className="h-5 w-5" />
                              </ListItemPrefix>
                              Profile
                            </ListItem>
                          </Link>
                          <Link to='/candidate/edit-details'>
                            <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                              <ListItemPrefix>
                                <Cog6ToothIcon className="h-5 w-5" />
                              </ListItemPrefix>
                              Edit Details
                            </ListItem>
                          </Link>
                        </List>
                      </AccordionBody>
                    </Accordion>
                  </motion.div>

                  <motion.div variants={listItemVariants}>
                    <Accordion
                      open={accordionOpen === 2}
                      icon={
                        <ChevronDownIcon
                          strokeWidth={2.5}
                          className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 2 ? "rotate-180" : ""}`}
                        />
                      }
                    >
                      <ListItem className="p-0" selected={accordionOpen === 2}>
                        <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3 hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                          <ListItemPrefix>
                            <ShoppingBagIcon className="h-5 w-5" />
                          </ListItemPrefix>
                          <Typography color="white" className="mr-auto font-medium">
                            Jobs
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0">
                          <Link to='/jobs'>
                            <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                              <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 w-5" />
                              </ListItemPrefix>
                              Apply Jobs
                            </ListItem>
                          </Link>
                          <Link to='/candidate/applied-jobs'>
                            <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                              <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 w-5" />
                              </ListItemPrefix>
                              Applied Jobs
                            </ListItem>
                          </Link>
                        </List>
                      </AccordionBody>
                    </Accordion>
                  </motion.div>

                  <hr className="my-4 border-blue-400/50" />
                  
                  <motion.div variants={listItemVariants}>
                    <Link to='/candidate/Notifications'>
                      <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200">
                        <ListItemPrefix>
                          <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Notifications
                        <ListItemSuffix>
                          <Chip value="0" size="sm" color="blue" className="rounded-full bg-blue-400 text-white" />
                        </ListItemSuffix>
                      </ListItem>
                    </Link>
                  </motion.div>

                  <motion.div variants={listItemVariants}>
                    <ListItem className="hover:bg-blue-700/50 rounded-lg transition-all duration-200" onClick={handleLogout}>
                      <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      Log Out
                    </ListItem>
                  </motion.div>
                </List>

                <motion.div variants={listItemVariants} className="p-4 mt-8">
                  <Button
                    size="lg"
                    fullWidth
                    color="white"
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    onClick={handleUpgrade}
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                    Upgrade to Apply Abroad
                  </Button>
                </motion.div>
              </div>
            </Drawer>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog 
        open={openModal} 
        handler={() => setOpenModal(false)}
        className="bg-white shadow-xl rounded-2xl"
      >
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white rounded-t-2xl">
          Upgrade to Apply Jobs Outside India
        </DialogHeader>
        <DialogBody divider className="bg-gray-100">
          <Typography color="blue-gray" className="mt-4 font-normal">
            Unlock opportunities to apply for jobs worldwide.
          </Typography>
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <Typography variant="h3" color="blue-gray" className="font-bold">
              $100
            </Typography>
            <Typography color="blue-gray" className="mt-1 font-normal">
              One-time payment for unlimited access
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 bg-gray-100 rounded-b-2xl">
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="blue" 
            onClick={handlePayment}
            className="bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 transition-all duration-300"
          >
            Pay Now
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default SidebarWithBurgerMenu;