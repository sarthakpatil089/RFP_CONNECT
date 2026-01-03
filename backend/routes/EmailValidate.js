import express from "express";
import { Op } from "sequelize";
import EmailVerificationToken from "../models/emailVerificationToken.js";
import Vendor from "../models/vendor.js";
import Buyer from "../models/buyer.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/verify-email", async (req, res) => {
  const { token, userId, userType } = req.query;
  const verificationToken = await EmailVerificationToken.findOne({
    where: {
      token,
      userId,
      usedAt: null,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!verificationToken) {
    return res.status(400).send("Invalid or expired token");
  }

  if (userType === "vendor") {
    await Vendor.update(
      { isEmailVerified: true, emailVerifiedAt: new Date(), status: "ACTIVE" },
      { where: { id: userId } }
    );
  } else {
    await Buyer.update(
      { isEmailVerified: true, emailVerifiedAt: new Date(), status: "ACTIVE" },
      { where: { id: userId } }
    );
  }

  await verificationToken.update({ usedAt: new Date() });

  res.redirect(
    `${process.env.PROTOCAL}://${process.env.DB_HOST}:${process.env.FE_PORT}/login?verified=true`
  );
});

export default router;
