import { EnvelopeIcon, FireIcon, LockClosedIcon, MapIcon, PhoneIcon, } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardHeader, Checkbox, Input, Typography } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRestaurant } from '../../../redux/slices/adminSlice';

const initialValues = {
  restaurantName: '',
  restaurantCity: '',
  mobileNumber: '',
  password: '',
  confirmPassword: '',
  email: '',
  acceptedTerms: false,
};

function AddRestaurant() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialValues);
  const [message, setMessage] = useState('');
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const handleButtonClick = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(addRestaurant(formData));
      setMessage('Restaurant added successfully!');
      setFormData(initialValues);
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      setMessage('Failed to add restaurant');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl shadow-xl">
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-blue-500 text-white text-center py-6">
          <Typography variant="h4" className="font-bold">Add New Restaurant</Typography>
        </CardHeader>
        <CardBody className="p-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="mt-8 mb-2 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'restaurantName', icon: FireIcon, placeholder: 'Enter restaurant name' },
                { name: 'restaurantCity', icon: MapIcon, placeholder: 'Enter city' },
                { name: 'mobileNumber', icon: PhoneIcon, placeholder: 'Enter mobile number' },
                { name: 'email', icon: EnvelopeIcon, placeholder: 'Enter email', type: 'email' },
                { name: 'password', icon: LockClosedIcon, placeholder: 'Enter password', type: 'password' },
                { name: 'confirmPassword', icon: LockClosedIcon, placeholder: 'Confirm password', type: 'password' },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <Typography color="blue-gray" className="font-medium mb-2 ml-1">
                    {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                    <Input
                      type={field.type || "text"}
                      size="lg"
                      name={field.name}
                      placeholder={field.placeholder}
                      className="pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-xl"
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center">
              <Checkbox
                id="acceptedTerms"
                name="acceptedTerms"
                onChange={handleChange}
                checked={formData.acceptedTerms}
                className="text-blue-500 rounded"
              />
              <Typography color="blue-gray" className="ml-3 font-medium">
                I agree with the{' '}
                <span
                  className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-300"
                  onClick={handleButtonClick}
                >
                  Terms and Conditions
                </span>
              </Typography>
            </div>
            <Button
              type="submit"
              fullWidth
              disabled={!formData.acceptedTerms}
              className="mt-8 bg-blue-500 hover:bg-blue-600 transition-colors duration-300 py-3 rounded-xl"
            >
              Add Restaurant
            </Button>
          </motion.form>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="paragraph"
                className="text-green-500 mt-4 text-center font-medium"
              >
                {message}
              </Typography>
            </motion.div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default AddRestaurant;