import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType'
  },
  userType: {
    type: String,
    required: true,
    enum: ['Users', 'Restaurant']
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['INITIATED', 'SUCCESS', 'FAILED', 'PENDING'],
    default: 'INITIATED'
  },
  paymentMethod: {
    type: String,
    default: 'PhonePe'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  details: {
    type: Object
  }
}, { timestamps: true });

const Transactions = mongoose.model('Transactions', transactionSchema);

export default Transactions;