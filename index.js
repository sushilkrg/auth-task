import express from "express";
import connectDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backing api running at port-${PORT}`));
});
