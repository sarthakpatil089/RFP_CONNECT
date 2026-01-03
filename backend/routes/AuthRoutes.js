import express from "express";
import { body, validationResult } from "express-validator";
import { loginHelper } from "../helpers/AuthHelper.js";


const router = express.Router();

router.post("/login",
    body("role").isIn(["BUYER", "VENDOR"]).withMessage("Role must be either 'buyer' or 'vendor'"),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const resp = await loginHelper(req.body);
        if (resp instanceof Error) {
            return res.status(401).json({ error: resp.message });
        }
        
        res.status(200).json(resp);
    }
);

export default router;