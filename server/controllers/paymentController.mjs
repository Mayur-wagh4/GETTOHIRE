import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const merchant_id = process.env.MERCHANT_ID;
const salt_key = process.env.SALT_KEY;
const saltIndex = '1';

const createChecksum = (payload, endpoint) => {
  const string = payload + endpoint + salt_key;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return `${sha256}###${saltIndex}`;
};

export const initiatePayment = async (req, res) => {
  console.log('Initiating payment...');
  try {
    const { transactionId, MUID, name, amount, number } = req.body;
    console.log(`Payment details: TransactionId: ${transactionId}, Amount: ${amount}, Number: ${number}`);

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      merchantUserId: MUID,
      amount: amount * 100,
      redirectUrl: `http://localhost:5173/payment-status/id=${transactionId}`,
      redirectMode: 'POST',
      // callbackUrl: `http://localhost:3000/api-v1/payment/callback`,
      // http://43.204.238.196:3000/
      callbackUrl: ` http://43.204.238.196:3000/api-v1/payment/callback`,

      mobileNumber: number,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payload = Buffer.from(JSON.stringify(data)).toString('base64');
    const checksum = createChecksum(payload, '/pg/v1/pay');

    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

    const options = {
      method: 'POST',
      url: prod_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: payload
      }
    };

    const response = await axios.request(options);
    console.log("PhonePe API Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data || "Internal server error", 
      success: false 
    });
  }
};

export const checkPaymentStatus = async (req, res) => {
  console.log('Checking payment status...');
  try {
    const merchantTransactionId = req.query.id;
    console.log(`Checking status for transaction: ${merchantTransactionId}`);

    const checksum = createChecksum('', `/pg/v1/status/${merchant_id}/${merchantTransactionId}`);

    const options = {
      method: 'GET',
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchant_id}`
      }
    };

    const response = await axios.request(options);
    console.log("PhonePe Status API Response:", response.data);
    
    const redirectUrl = response.data.success
      ? 'http://localhost:5173/payment/success'
      : 'http://localhost:5173/payment/failure';

    res.json({
      success: response.data.success,
      redirectUrl: redirectUrl
    });
  } catch (error) {
    console.error("Error checking payment status:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data || "Internal server error", 
      success: false 
    });
  }
};

export const handlePaymentCallback = async (req, res) => {
  console.log('Handling payment callback...');
  try {
    const callbackData = req.body;
    console.log('Callback data:', callbackData);
    
    // TODO: Update your database with the payment status
    
    res.json({ status: 'OK' });
  } catch (error) {
    console.error("Error handling payment callback:", error.message);
    res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};