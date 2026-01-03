import express from "express";
import { body, validationResult, param } from "express-validator";

import {
  signupHelper,
  vendorOnboardingStep1Helper,
  getVendorByid,
  getAllVendors,
} from "../helpers/VendorHelper.js";
import VendorProduct from "./VendorProducts.js";
import { authenticateUser } from "../middleware/authenicateUser.js";

const router = express.Router();

// nested route for vendor products
router.use("/:vendorId/product", VendorProduct);

// Vendor Registration Route
router.post(
  "/register",
  body("vendorCompanyName")
    .notEmpty()
    .withMessage("Vendor company name is required"),
  body("emailAddress").isEmail().withMessage("Valid email is required"),
  body("mainProductService")
    .notEmpty()
    .withMessage("Main product/service is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const resp = await signupHelper(req.body);
      if (resp.success) {
        res.status(201).json(resp);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// get vendor by id
router.get(
  "/:proposal/:id",
  authenticateUser,
  param("proposal").isBoolean().withMessage("Proposal is required"),
  param("id").isUUID().withMessage("Valid vendor ID is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const userId = req.user.id;
      let { id, proposal } = req.params;
      proposal =
        proposal !== "true" ? (userId === id ? "true" : "false") : "false";
      const resp = await getVendorByid(id, proposal);
      return res.status(200).json(resp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Vendor Onboarding Route 1
router.put(
  "/onboard/step1/:id",
  authenticateUser,
  param("id").isUUID().withMessage("Valid vendor ID is required"),
  body("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("pincode").notEmpty().withMessage("Postal code is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("establishedDate")
    .notEmpty()
    .withMessage("Establishment date is required"),
  body("deliveryTimeframe")
    .notEmpty()
    .withMessage("Delivery Time frame is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const resp = await vendorOnboardingStep1Helper(req.params.id, req.body);
      if (resp.success) {
        res.status(200).json(resp);
      } else {
        res.status(400).json({ error: resp.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//get all vendors
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const resp = await getAllVendors(userId);
    if (resp.success) {
      res.status(200).json(resp);
    } else {
      res.status(400).json({ error: resp.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
