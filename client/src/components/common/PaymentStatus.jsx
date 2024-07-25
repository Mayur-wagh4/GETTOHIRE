import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PaymentStatus() {
  const [status, setStatus] = useState('checking');
  const { transactionId } = useParams();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setStatus('checking');
        const response = await fetch(`http://localhost:3000/api-v1/candidates/check-payment-status/${transactionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.state === 'COMPLETED') {
          setStatus('success');
        } else if (data.state === 'PENDING') {
          setStatus('pending');
        } else {
          setStatus('failure');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };

    checkPaymentStatus();
  }, [transactionId]);

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return <p>Checking payment status...</p>;
      case 'success':
        return <p>Payment successful!</p>;
      case 'pending':
        return <p>Payment is pending. Please wait...</p>;
      case 'failure':
        return <p>Payment failed.</p>;
      case 'error':
        return (
          <div>
            <p>An error occurred while checking the payment status.</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payment-status">
      <h2>Payment Status</h2>
      {renderContent()}
    </div>
  );
}

export default PaymentStatus;