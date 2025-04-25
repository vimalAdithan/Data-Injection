import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected 🔥`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
