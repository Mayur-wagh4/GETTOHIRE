import { XMarkIcon } from "@heroicons/react/24/solid";
import { Alert, Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Icon({ type }) {
  const iconColor = type === 'success' ? 'text-green-500' : type === 'warning' ? 'text-amber-500' : 'text-red-500';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-6 w-6 ${iconColor}`}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const jobs = useSelector((state) => state.candidate.jobPosts);

  useEffect(() => {
    if (jobs.length > 0) {
      const newJobsCount = jobs.filter(job => job.isNew).length;
      if (newJobsCount > 0) {
        addNotification(`${newJobsCount} new job${newJobsCount > 1 ? 's' : ''} available!`, 'success');
      }
    }
  }, [jobs]);

  const addNotification = (message, type = 'success') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      open: true,
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const closeNotification = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, open: false } : notification
      )
    );
  };

  const handleCloseAll = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, open: false })));
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl w-full max-w-3xl mx-auto rounded-xl overflow-hidden">
      <CardBody className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-full">
            <Typography variant="h2" color="white" className="text-center mb-6 font-bold text-3xl">
              Notifications
            </Typography>
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 50, scale: 0.3 }}
                  animate={{ opacity: notification.open ? 1 : 0, y: notification.open ? 0 : 50, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="mb-4"
                >
                  <Alert
                    open={notification.open}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                    icon={<Icon type={notification.type} />}
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 100 },
                    }}
                    dismissible={{
                      onClose: () => closeNotification(notification.id),
                    }}
                    action={
                      <XMarkIcon
                        strokeWidth={2}
                        className="h-6 w-6 cursor-pointer"
                        onClick={() => closeNotification(notification.id)}
                      />
                    }
                  >
                    <Typography variant="h6" color="blue-gray" className="mb-1 font-bold">
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Typography>
                    <Typography color="gray" className="font-normal opacity-80">
                      {notification.message}
                    </Typography>
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
            {notifications.some((notification) => notification.open) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleCloseAll}
                  className="mt-6 bg-red-500 hover:bg-red-600 transition-colors duration-300 w-full py-3 rounded-lg text-white font-bold shadow-md hover:shadow-lg"
                >
                  Close All
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationComponent;