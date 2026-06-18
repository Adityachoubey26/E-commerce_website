import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Error connecting to MongoDB: ${error.message}`);
    console.warn('Backend server will start, but database operations will fail until MongoDB is running.');
  }
};

export default connectDB;
