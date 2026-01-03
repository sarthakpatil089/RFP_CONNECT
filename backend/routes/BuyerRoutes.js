import express from "express";
import { body, validationResult, param } from "express-validator";
import {
  signupHelper,
  getAllBuyers,
  getBuyerById,
} from "../helpers/BuyerHelper.js";
import { authenticateUser } from "../middleware/authenicateUser.js";

const router = express.Router();

router.post(
  "/register",
  body("firstName").notEmpty().withMessage("first name is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("emailAddress").isEmail().withMessage("Valid email is required"),
  body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
  body("addressLine"),
  body("city").notEmpty().withMessage("Phone Number is required"),
  body("state").notEmpty().withMessage("Phone Number is required"),
  body("postalCode").notEmpty().withMessage("Phone Number is required"),
  body("country").notEmpty().withMessage("Phone Number is required"),
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

//get all buyers
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const id = req.user.id;
    const resp = await getAllBuyers(id);
    if (resp.success) {
      res.status(200).json(resp);
    } else {
      res.status(400).json({ error: resp.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get buyer by id
router.get(
  "/:id",
  authenticateUser,
  param("id").isUUID().withMessage("Valid vendor ID is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const userId = req.user.id;
    const getUnMaskedData = userId ===id
    try {
      const resp = await getBuyerById(id,getUnMaskedData);
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
export default router;
