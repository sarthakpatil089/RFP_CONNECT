import jwt from "jsonwebtoken";
import Vendor from "../models/vendor.js";
import Buyer from "../models/buyer.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET); 
    const { id, role } = decoded;

    let user = null;

    if (role === "VENDOR") {
      user = await Vendor.findByPk(id, { attributes: { exclude: ["passwordHash"] } });
      if (!user) return res.status(401).json({ message: "Vendor not found" });
    } else if (role === "BUYER") {
      user = await Buyer.findByPk(id, { attributes: { exclude: ["passwordHash"] } });
      if (!user) return res.status(401).json({ message: "Buyer not found" });
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    req.user = { id, role };
    req.vendor = role === "VENDOR" ? user : null;
    req.buyer = role === "BUYER" ? user : null;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
