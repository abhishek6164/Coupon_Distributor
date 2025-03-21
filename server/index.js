import express from "express";
import connectDB from "./config/mongodb.js"; // ✅ Correct Import
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

connectDB(); // ✅ Ensure Function is Called After Import

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!")
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
