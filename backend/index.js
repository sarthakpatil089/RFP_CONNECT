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

app.use(cors());
app.use(
  cors({
    origin: `${process.env.PROTOCAL}://${process.env.DB_HOST}:${process.env.FE_PORT}`,
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
