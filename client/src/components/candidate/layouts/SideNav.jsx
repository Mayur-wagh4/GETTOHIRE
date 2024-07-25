import {
  ChevronDownIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  GlobeAltIcon,
  InboxIcon,
  PowerIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon
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
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-full w-full shadow-xl">
                <div className="text-white p-6">
                  <Typography variant="h4" className="font-bold text-3xl mb-2">
                    Dashboard
                  </Typography>
                  <Typography variant="medium" className="hidden md:block">
        <span className="text-white">Welcome,</span>{' '}
              <span className="text-deep-orange-500">{details?.name || 'Candidate'}</span>
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
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                          <ListItemPrefix>
                            <PresentationChartBarIcon className="h-5 text-white w-5" />
                          </ListItemPrefix>
                          <Typography color="white" className="mr-auto font-medium">
                            My Dashboard
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0">
                          <Link to='/candidate' onClick={closeSidenav}>
                            <ListItem className="hover:bg-gray-700/50 rounded-lg text-white transition-all duration-200">
                              <ListItemPrefix>
                                <UserCircleIcon className="h-5 text-white w-5" />
                              </ListItemPrefix>
                              Profile
                            </ListItem>
                          </Link>
                          <Link to='/candidate/edit-details' onClick={closeSidenav}>
                            <ListItem className="hover:bg-gray-700/50 rounded-lg text-white transition-all duration-200">
                              <ListItemPrefix>
                                <Cog6ToothIcon className="h-5 text-white w-5" />
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
                        <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                          <ListItemPrefix>
                            <ShoppingBagIcon className="h-5 text-white w-5" />
                          </ListItemPrefix>
                          <Typography color="white" className="mr-auto font-medium">
                            Jobs
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0">
                          <Link to='/jobs' onClick={closeSidenav}>
                            <ListItem className="hover:bg-gray-700/50 rounded-lg text-white transition-all duration-200">
                              <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 text-white w-5" />
                              </ListItemPrefix>
                              Apply Jobs
                            </ListItem>
                          </Link>
                          <Link to='/candidate/applied-jobs' onClick={closeSidenav}>
                            <ListItem className="hover:bg-gray-700/50 text-white rounded-lg transition-all duration-200">
                              <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 text-white w-5" />
                              </ListItemPrefix>
                              Applied Jobs
                            </ListItem>
                          </Link>
                        </List>
                      </AccordionBody>
                    </Accordion>
                  </motion.div>

                  <hr className="my-4 border-gray-600" />
                  
                  <motion.div variants={listItemVariants}>
                    <Link to='/candidate/Notifications' onClick={closeSidenav}>
                      <ListItem className="hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                        <ListItemPrefix>
                          <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Notifications
                        <ListItemSuffix>
                          <Chip value="0" size="sm" color="orange" className="rounded-full bg-deep-orange-500 text-white" />
                        </ListItemSuffix>
                      </ListItem>
                    </Link>
                  </motion.div>

                  <motion.div variants={listItemVariants}>
                    <ListItem className="hover:bg-gray-700/50 rounded-lg transition-all duration-200" onClick={handleLogout}>
                      <ListItemPrefix>
                        <PowerIcon className="h-5 text-red-500 w-5" />
                      </ListItemPrefix>
                      Log Out
                    </ListItem>
                  </motion.div>
                </List>

                {!details.isPremium && (
                  <motion.div variants={listItemVariants} className="p-4 mt-8">
                    <Button
                      size="lg"
                      fullWidth
                      color="white"
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-deep-orange-500 to-orange-500 hover:from-deep-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      onClick={handleUpgrade}
                    >
                      <GlobeAltIcon className="h-5 w-5" />
                      Upgrade to Apply Abroad
                    </Button>
                  </motion.div>
                )}
              </div>
            </Drawer>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog 
        open={openModal} 
        handler={() => setOpenModal(false)}
        className="bg-white shadow-2xl rounded-xl overflow-hidden border border-orange-500/20"
      >
        <DialogHeader className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          Upgrade to Apply Jobs Outside India
        </DialogHeader>
        <DialogBody divider className="bg-gradient-to-b from-gray-100 to-gray-200 p-6">
          <Typography color="blue-gray" className="mt-4 font-normal">
            Unlock opportunities to apply for jobs worldwide.
          </Typography>
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <Typography variant="h3" color="blue-gray" className="font-bold flex items-center">
              <CurrencyRupeeIcon className="h-8 w-8 mr-2 text-deep-orange-500" />
              1
            </Typography>
            <Typography color="blue-gray" className="mt-1 font-normal">
              One-time payment for unlimited access
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 bg-gradient-to-b from-gray-100 to-gray-200 p-4">
          <Button variant="outlined" color="blue-gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="deep-orange" 
            onClick={handlePayment}
            className="bg-gradient-to-r from-deep-orange-500 to-orange-500 hover:from-deep-orange-600 hover:to-orange-600 transition-all duration-300"
          >
            Pay Now
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default SidebarWithBurgerMenu;