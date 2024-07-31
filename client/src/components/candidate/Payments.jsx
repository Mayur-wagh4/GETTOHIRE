import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkPaymentStatus,
  initiatePayment,
  resetPayment,
} from "../../redux/slices/candidateSlice";

const PaymentStatus = {
  INITIATED: "INITIATED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  TIMEOUT: "TIMEOUT",
};

const AlertColors = {
  [PaymentStatus.INITIATED]: "blue",
  [PaymentStatus.PENDING]: "yellow",
  [PaymentStatus.COMPLETED]: "green",
  [PaymentStatus.FAILED]: "red",
  [PaymentStatus.TIMEOUT]: "orange",
};

const StatusMessages = {
  [PaymentStatus.INITIATED]: "Payment initiated. Please complete the payment on the opened page.",
  [PaymentStatus.PENDING]: "Payment is pending. Please wait while we confirm your payment.",
  [PaymentStatus.COMPLETED]: "Payment successful! Thank you for your purchase.",
  [PaymentStatus.FAILED]: "Payment failed. Please try again or contact support.",
  [PaymentStatus.TIMEOUT]: "Payment not completed within the time limit. Please try again.",
};

const Payment = () => {
  const dispatch = useDispatch();
  const { details, paymentData, paymentStatus, paymentLoading, paymentError } = useSelector((state) => state.candidate);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

  const handlePayment = useCallback(async (e) => {
    e.preventDefault();
    dispatch(resetPayment());
    const result = await dispatch(
      initiatePayment({
        userId: details._id,
        name: details.name,
        amount: 1,
        number: details.contact,
      })
    );
    if (initiatePayment.fulfilled.match(result) && result.payload.paymentUrl) {
      window.open(result.payload.paymentUrl, "_blank");
    }
  }, [dispatch, details]);

  const handlePaymentStatus = useCallback(async (transactionId) => {
    const result = await dispatch(checkPaymentStatus(transactionId));
    if (checkPaymentStatus.fulfilled.match(result)) {
      return result.payload.state;
    }
    return null;
  }, [dispatch]);

  useEffect(() => {
    if (paymentData?.transactionId && paymentStatus === PaymentStatus.INITIATED) {
      const startTime = Date.now();
      const timeoutDuration = 15 * 60 * 1000; // 15 minutes timeout

      const pollPaymentStatus = async () => {
        const state = await handlePaymentStatus(paymentData.transactionId);
        if (state === PaymentStatus.COMPLETED || state === PaymentStatus.FAILED) return;

        if (Date.now() - startTime >= timeoutDuration) {
          dispatch(resetPayment());
          setShowTimeoutDialog(true);
          return;
        }

        // Implement the recommended polling interval
        const timePassed = Date.now() - startTime;
        let nextInterval;
        if (timePassed < 50000) { // First 50 seconds
          nextInterval = 3000;
        } else if (timePassed < 110000) { // Next 60 seconds
          nextInterval = 6000;
        } else if (timePassed < 170000) { // Next 60 seconds
          nextInterval = 10000;
        } else if (timePassed < 230000) { // Next 60 seconds
          nextInterval = 30000;
        } else { // Remaining time
          nextInterval = 60000;
        }

        setTimeout(pollPaymentStatus, nextInterval);
      };

      // Initial check after 20-25 seconds
      setTimeout(pollPaymentStatus, 22000);
    }
  }, [dispatch, paymentData, paymentStatus, handlePaymentStatus]);

  const renderPaymentStatus = () => {
    if (!paymentData) return null;

    const alertColor = AlertColors[paymentStatus] || "gray";
    const statusMessage =
      StatusMessages[paymentStatus] ||
      paymentError ||
      "Unknown payment status. Please contact support.";

    return (
      <>
        <Alert color={alertColor} className="mt-4">
          {statusMessage}
        </Alert>
        {paymentData.transactionId && (
          <Typography variant="small" className="mt-2">
            Transaction ID: {paymentData.transactionId}
          </Typography>
        )}
        {[PaymentStatus.INITIATED, PaymentStatus.PENDING].includes(
          paymentStatus
        ) && (
          <Typography variant="small" className="mt-2">
            Checking payment status...
          </Typography>
        )}
      </>
    );
  };

  const showPaymentForm =
    !paymentData || [PaymentStatus.FAILED, PaymentStatus.TIMEOUT].includes(paymentStatus);

  const handleTimeoutDialogClose = () => {
    setShowTimeoutDialog(false);
    dispatch(resetPayment());
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg">
      {showPaymentForm && (
        <form onSubmit={handlePayment} className="mb-6">
          <Typography variant="h5" className="mb-6 text-center text-white">
            Payment Details
          </Typography>
          {["name", "contact"].map((field) => (
            <div key={field} className="mb-4">
              <Typography variant="h6" className="text-white">
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                {details[field]}
              </Typography>
            </div>
          ))}
          <div className="mb-4">
            <Typography variant="h6" className="text-white">
              <strong>Amount:</strong> 1 Rs
            </Typography>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              color="deep-orange"
              className="w-full bg-gradient-to-r from-deep-orange-500 to-orange-500 hover:from-deep-orange-600 hover:to-orange-600 transition-all duration-300"
              disabled={paymentLoading}
            >
              {paymentLoading ? <Spinner size="sm" className="mr-2" /> : "Pay Now"}
            </Button>
          </div>
        </form>
      )}

      {renderPaymentStatus()}

      {paymentData?.paymentUrl && paymentStatus === PaymentStatus.INITIATED && (
        <Alert color="blue" className="mt-4 text-white">
          If the payment page didn't open automatically,
          <Button
            color="blue"
            onClick={() => window.open(paymentData.paymentUrl, "_blank")}
            className="ml-2 text-white"
          >
            click here
          </Button>
        </Alert>
      )}

      <Dialog open={showTimeoutDialog} handler={handleTimeoutDialogClose}>
        <DialogHeader className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          Payment Time Limit Exceeded
        </DialogHeader>
        <DialogBody className="bg-gray-200 text-gray-800">
          The payment was not completed within the 2-minute time limit. Please try again.
        </DialogBody>
        <DialogFooter className="bg-gray-200">
          <Button variant="gradient" color="deep-orange" onClick={handleTimeoutDialogClose}>
            <span>OK</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Payment;