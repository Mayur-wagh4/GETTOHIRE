import { Button, Input, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../../../assets/assets";
import { loginCandidate } from '../../../redux/slices/candidateSlice';
import Footer from '../../common/footer';
import ComplexNavbar from '../../common/navbar';

export function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, userId } = useSelector((state) => state.candidate);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    dispatch(loginCandidate(formData));
  };
  useEffect(() => {
    console.log("SignIn component mounted");
  }, []);
  useEffect(() => {
    if (token && userId) {
      navigate('/candidate');
    }
  }, [token, userId, navigate]);

  useEffect(() => {
    if (error) {
      console.log("Error: ", error);
    }
  }, [error]);

  return (
    <>
      <ComplexNavbar />
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="m-8 flex flex-col lg:flex-row items-center justify-center gap-4 shadow-lg rounded-xl p-8 bg-white"
      >
        <div className="w-full lg:w-3/5 mt-2">
          <div className="text-center">
            <Typography variant="h2" color="black" className="font-bold mb-4">
              Sign In
            </Typography>
            <Typography variant="paragraph" color="gray" className="text-lg font-normal">
              Enter your email and password to Sign In.
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-full max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
            <div className="mb-6 flex flex-col gap-6">
              <Typography variant="small" color="gray" className="-mb-3 font-medium">Email</Typography>
              <Input
                name="email"
                size="lg"
                placeholder="Email"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 transition-all hover:shadow-lg hover:bg-gray-100"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <Typography variant="small" color="gray" className="-mb-3 font-medium">Password</Typography>
              <Input
                name="password"
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 transition-all hover:shadow-lg hover:bg-gray-100"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <Button className="mt-6 transition-all hover:bg-blue-600 hover:shadow-lg" fullWidth type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Not registered? <Link to="/candidate-register" className="text-blue-500 ml-1">Create account</Link>
            </Typography>
            {error && (
              <Typography variant="paragraph" className="text-red-500 mt-4">
                {error}
              </Typography>
            )}
          </form>
        </div>
        <div className="w-full lg:w-2/5 hidden lg:block">
          <motion.img
            src={signin}
            className="h-full w-full object-cover rounded-e-3xl rounded-s-xl transition-all duration-500 ease-in-out transform hover:scale-105"
            alt="Pattern"
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </motion.section>
      <Footer className="fixed bottom-0 w-full" />
    </>
  );
}

export default SignIn;
