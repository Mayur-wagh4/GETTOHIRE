import { Alert, Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
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
  const dispatch = useDispatch();

  // Example of receiving notifications from Redux store
  const jobApplicationNotification = useSelector(state => state.notification.jobApplication);

  useEffect(() => {
    // Simulating receiving notifications from Redux action
    if (jobApplicationNotification) {
      addNotification('New job application received', 'info');
    }
  }, [jobApplicationNotification]);

  const addNotification = (message, type = 'success') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      open: true,
    };
    setNotifications([...notifications, newNotification]);
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
    <Card className="bg-white shadow-lg w-full max-w-3xl rounded-lg">
      <CardBody>
        <div className="flex flex-col items-center">
          <div className="w-full">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: notification.open ? 1 : 0, y: notification.open ? 0 : 50 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Alert
                  open={notification.open}
                  className="w-full"
                  icon={<Icon />}
                  onClose={() => closeNotification(notification.id)}
                  color={
                    notification.type === 'success'
                      ? 'green'
                      : notification.type === 'warning'
                      ? 'amber'
                      : notification.type === 'error'
                      ? 'red'
                      : 'blue'
                  }
                >
                  <Typography variant="h5" color="white">
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </Typography>
                  <Typography color="white" className="mt-2 font-normal">
                    {notification.message}
                  </Typography>
                </Alert>
              </motion.div>
            ))}
            {notifications.some((notification) => notification.open) && (
              <Button onClick={handleCloseAll} className="mt-4">
                Close All
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationComponent;
