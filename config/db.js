import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbName =
      process.env.NODE_ENV === "test" ? "mern-todo-test" : "mern-todo";
    await mongoose.connect(process.env.MONGO_URI, { dbName });
    console.log(`MongoDB Connected: ${dbName}`);
  } catch (err) {
    console.error("DB Connection Failed", err.message);
    process.exit(1);
  }
};

export default connectDB;
