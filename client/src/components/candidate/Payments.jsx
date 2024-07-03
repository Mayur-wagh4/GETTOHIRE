import {
  Alert,
  Button,
  Spinner,
  Typography
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = {
    name: "Mayur",
    amount: 1,
    number: "1234567891",
    MUID: `MUID${Date.now()}`,
    transactionId: `T${Date.now()}`,
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // const response = await axios.post("http://localhost:3000/api-v1/payment/initiate", data);
      const response = await axios.post("http://43.204.238.196:3000/api-v1/payment/initiate", data);
      
      if (response.data && response.data.data.instrumentResponse.redirectInfo.url) {
        window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error("No redirect URL received from payment initiation");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError(error.response?.data?.message || "An error occurred while initiating payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="p-6 bg-gray-800 rounded-lg shadow-md">
      <Typography variant="h5" className="mb-6 text-center">
        Payment Details
      </Typography>
      <div className="mb-4">
        <Typography variant="h6">
          <strong>Name:</strong> {data.name}
        </Typography>
      </div>
      <div className="mb-4">
        <Typography variant="h6">
          <strong>Number:</strong> {data.number}
        </Typography>
      </div>
      <div className="mb-4">
        <Typography variant="h6">
          <strong>Amount:</strong> {data.amount} Rs
        </Typography>
      </div>
      {error && (
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
      )}
      <div className="flex justify-center">
        <Button
          type="submit"
          color="green"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" className="mr-2" /> : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export default Payment;
