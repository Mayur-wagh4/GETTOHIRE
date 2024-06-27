import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const merchant_id = process.env.MERCHANT_ID 
const salt_key = process.env.SALT_KEY 
const saltIndex = '1';
export const initiatePayment = async (req, res) => {
  try {
    const { transactionId, MUID, name, amount, number } = req.body;

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: transactionId,
      merchantUserId: MUID,
      name: name,
      amount: amount * 100, 
      redirectUrl: `http://localhost:3000/status/?id=${transactionId}`,
      redirectMode: 'POST',
      mobileNumber: number,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = '1';
    const string = payloadMain + '/pg/v1/pay' + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

    const options = {
      method: 'POST',
      url: prod_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      data: {
        request: payloadMain
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const merchantTransactionId = req.query.id;
    const keyIndex = '1';
    const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchant_id}`
      }
    };

    const response = await axios.request(options);

    if (response.data.success) {
      res.redirect(`http://localhost:5173/success`);
    } else {
      res.redirect(`http://localhost:5173/failure`);
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};