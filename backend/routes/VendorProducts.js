import express from "express";
import { body, validationResult, param } from "express-validator";
import { authenticateUser } from "../middleware/authenicateUser.js";
import VendorProduct from "../models/product.js";

const router = express.Router({ mergeParams: true });

//create bulk products
router.post(
  "",
  authenticateUser,
  param("vendorId").isUUID().withMessage("Valid vendor ID is required"),
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products array is required with at least 1 product"),
  body("products.*.productName")
    .notEmpty()
    .withMessage("Each product name is required"),
  body("products.*.description")
    .notEmpty()
    .withMessage("Each product description is required"),
  body("products.*.category")
    .notEmpty()
    .withMessage("Each product category is required"),
  body("products.*.price")
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Each product price must be a valid positive number"),
  body("products.*.deliveryTime")
    .notEmpty()
    .withMessage("Each product delivery time is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { vendorId } = req.params;
      const { products } = req.body;

      const createdProducts = await VendorProduct.bulkCreate(
        products.map((product) => ({
          vendorId,
          productName: product.productName,
          description: product.description,
          category: product.category,
          price: parseFloat(product.price),
          deliveryTime: product.deliveryTime,
        })),
        {
          validate: true,
          individualHooks: true,
        }
      );

      return res.status(201).json({
        success: true,
        message: `${createdProducts.length} products created successfully`,
        products: createdProducts,
      });
    } catch (error) {
      console.error("Bulk product creation error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create products",
      });
    }
  }
);

//get all products by vendor id
router.get(
  "",
  authenticateUser,
  param("vendorId").isUUID().withMessage("Valid vendor ID is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { vendorId } = req.params;
      const products = await VendorProduct.findAll({ where: { vendorId } });
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          error: error.message || "Failed to fetch products",
        });
    }
  }
);

export default router;
