import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  permissions: [{
    type: String,
  }],
}, { timestamps: true });

// Method to create a JWT token
AdminSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
