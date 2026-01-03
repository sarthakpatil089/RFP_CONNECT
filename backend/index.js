/* eslint-disable no-undef */
import dotenv, { config } from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectToDatabase from "./database.js";
import { startServer } from "./serverInit.js";
import VendorRoutes from "./routes/VendorRoutes.js";
import BuyerRoutes from "./routes/BuyerRoutes.js";
import EmailValidate from "./routes/EmailValidate.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import RfpRoutes from "./routes/RfpRoutes.js";

config();
const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  "https://rfp-connect.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(json());
await connectToDatabase();

app.use("/api/vendor", VendorRoutes);
app.use("/api/buyer", BuyerRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api", EmailValidate);
app.use("/api/rfp", RfpRoutes);
const port = process.env.PORT || 8080;

await startServer(port, app);
