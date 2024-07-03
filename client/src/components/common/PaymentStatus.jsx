import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PaymentStatus() {
  const [status, setStatus] = useState('checking');
  const { transactionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api-v1/payment/status?id=${transactionId}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Since our backend is handling the redirect, we'll get redirected before we can process the response.
        // However, we'll keep this logic in case we change our approach in the future.
        const data = await response.json();
        if (data.success) {
          setStatus('success');
          navigate('/payment/success');
        } else {
          setStatus('failure');
          navigate('/payment/failure');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };

    checkPaymentStatus();
  }, [transactionId, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return <p>Checking payment status...</p>;
      case 'success':
        return <p>Payment successful! Redirecting...</p>;
      case 'failure':
        return <p>Payment failed. Redirecting...</p>;
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