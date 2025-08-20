import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

// init express
const app = express();

// middleware
app.use(
  cors({
    origin: "https://mern-todo-923.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;
