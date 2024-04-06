import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connect successfully!"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

// Middleware for handling error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
