import express from "express";
import { Op } from "sequelize";
import crypto from "crypto";
import { param, validationResult } from "express-validator";

import { authenticateUser } from "../middleware/authenicateUser.js";
import { responseToBuyerProposalByVendor } from "../helpers/rfpVendorHelper.js";
import { sendVendorBuyersProposal } from "../helpers/EmailHelper.js";
import EmailVerificationToken from "../models/emailVerificationToken.js";
import {
  createRFP,
  getRFPByBuyerId,
  getRFPByBuyerIdWithVendors,
  getMiniRFPByBuyerId,
  reSubmitRFP,
} from "../helpers/rfpHelper.js";

const router = express.Router();

// add RFP
router.post("/", authenticateUser, async (req, res) => {
  try {
    const rfp = await createRFP(req);

    return res.status(201).json({ success: true, rfpId: rfp.toJSON().id });
  } catch (err) {
    console.error("RFP submit error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

//  get all rfps with buyer id
router.get("/", authenticateUser, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const rfps = await getRFPByBuyerId(buyerId);
    return res.status(200).json({ success: true, data: rfps });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//mini API for less data
router.get("/mini", authenticateUser, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const rfps = await getMiniRFPByBuyerId(buyerId);
    return res.status(200).json({ success: true, data: rfps });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//  get all details of a Rfp including vendors
router.get(
  "/:id",
  param("id").isUUID().withMessage("RFP Id is mandatory"),
  authenticateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const buyerId = req.user.id;
      const rfps = await getRFPByBuyerIdWithVendors(buyerId, id);
      return res.status(200).json({ success: true, data: rfps });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

//re-submit RFP for processing
router.post(
  "/:id",
  param("id").isUUID().withMessage("RFP Id is mandatory"),
  authenticateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      await reSubmitRFP(id);
      return res.status(200).json({ success: true, data: null });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

// send vendor mail for rfp
router.post(
  "/send-vendor-mail/:userId/:rfpId",
  param("userId").isUUID().withMessage("Vendor Id is mandatory"),
  param("rfpId").isUUID().withMessage("RFP Id is mandatory"),
  authenticateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { userId, rfpId } = req.params;
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await EmailVerificationToken.create({
        vendorId: userId,
        token,
        expiresAt,
        userId,
      });
      const { success, error } = await sendVendorBuyersProposal(
        token,
        userId,
        rfpId
      );
      if (!success) throw new Error(error);
      return res.status(200).json({ success: success, data: null });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);
// take vendor response for buyer's proposal
router.get(
  "/vendor-response/:token/:userId/:rfpId/:isAccepted",
  param("token"),
  param("userId").isUUID().withMessage("User Id is mandatory"),
  param("rfpId").isUUID().withMessage("RFP Id is mandatory"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, userId, rfpId, isAccepted } = req.params;

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
      verificationToken.usedAt = new Date();
      await verificationToken.save();
      await responseToBuyerProposalByVendor(rfpId, userId, isAccepted);
      return res.status(200).json({ success: true, data: null });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
