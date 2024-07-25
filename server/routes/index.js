import express from 'express';
import { sendEmail } from '../mail.js';
import adminRoute from './adminRoutes.js';
import authRoute from './authRoutes.js';
import restaurantRoute from './restaurantRoutes.js';
import userRoute from './userRoutes.js';

const router = express.Router();
const path = '/api-v1/';

// Use imported routes
router.use(`${path}auth`, authRoute);
router.use(`${path}candidates`, userRoute);
router.use(`${path}restaurants`, restaurantRoute);
router.use(`${path}admin`, adminRoute);

// Define the contact route
router.post('/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  const { fullName, emailAddress, phoneNumber, subject, userMessage } = req.body;

  try {
    // Compose the email content
    const emailContent = `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${emailAddress}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong> ${userMessage}</p>
    `;
    console.log(emailContent)
    
    // Send the email
    await sendEmail('receiver-email@example.com', subject, emailContent); // Replace with the actual recipient email
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
