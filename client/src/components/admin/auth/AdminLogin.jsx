import { Button, Input, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoNewImage } from "../../../assets/assets";
import { signInAdmin } from '../../../redux/slices/adminSlice';

import Footer from '../../common/footer';
import ComplexNavbar from '../../common/navbar';

export function SignIn() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signInError = useSelector((state) => state.admin.error);

 

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(signInAdmin({ username: userId, password }));
      if (signInAdmin.fulfilled.match(resultAction)) {
        navigate('/admin');
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  




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
            <Typography variant="h2" color="black" className="font-bold mb-4">Sign In</Typography>
            <Typography variant="paragraph" color="gray" className="text-lg font-normal">Enter your USER ID and PASSWORD to Sign In.</Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-full max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
            <div className="mb-6 flex flex-col gap-6">
              <Typography variant="small" color="gray" className="-mb-3 font-medium">USER ID</Typography>
              <Input
                size="lg"
                placeholder="USER ID"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 transition-all hover:shadow-lg hover:bg-gray-100"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <Typography variant="small" color="gray" className="-mb-3 font-medium">Password</Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 transition-all hover:shadow-lg hover:bg-gray-100"
                labelProps={{ className: "before:content-none after:content-none" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="mt-6 transition-all hover:bg-blue-600 hover:shadow-lg" fullWidth type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            {error && (
              <Typography variant="paragraph" className="text-red-500 mt-4">
                {error}
              </Typography>
            )}
          </form>
        </div>
        <div className="w-full lg:w-2/5 hidden lg:block">
          <motion.img
            src={LogoNewImage}
            className="w-[20] h-auto object-cover transition-transform duration-500 ease-in-out"
            alt="Pattern"
          />
        </div>
      </motion.section>
      <Footer className="fixed bottom-0 w-full" />
    </>
  );
}

export default SignIn;
