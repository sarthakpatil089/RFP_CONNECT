import { Queue, Worker } from "bullmq";
import Rfp from "../models/rfp.js";
import Vendor from "../models/vendor.js";
import Buyer from "../models/buyer.js";
import VendorProduct from "../models/product.js";
import { callAiParser } from "../services/aiServices.js";
import { shortlistVendors } from "./vendorShortlistingAlgo.js";
import RfpVendor from "../models/rfpVendor.js";
// import { sendEmailToVendors } from "../services/emailService";

export const rfpQueue = new Queue("rfpQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
  },
});

// Worker process (start in separate node process)
export const rfpWorker = new Worker(
  "rfpQueue",
  async (job) => {
    // console.log("queue",job)
    if (job.name !== "processRfp") {
      console.log("Invalid job name:", job.name);
      return;
    }
    const { rfpId } = job.data;

    const rfp = await Rfp.findByPk(rfpId);
    if (!rfp) {
      console.log("RFP not found");
      return;
    }
    const rfpJSON = rfp.toJSON();
    // AI parsing
    console.log("AI parsing started");
    const aiParsed = await callAiParser({
      title: rfpJSON.rfpTitle,
      requirements: rfpJSON.buyerExpectations,
      context: rfpJSON.additionalContext,
      budget: rfpJSON.budgetRange,
      expectedDelivery: rfpJSON.expectedDelivery,
    });
    console.log("AI parsing done", aiParsed);
    let buyer, vendors;
    try {
      // Buyer address details
      buyer = await Buyer.findByPk(rfp.toJSON().buyerId, {
        attributes: {
          exclude: ["passwordHash"],
        },
      });

      // Shortlist vendors
      vendors = await Vendor.findAll({
        attributes: {
          exclude: ["passwordHash"],
        },
        include: [
          {
            model: VendorProduct,
            as: "products",
            attributes: [
              "productName",
              "description",
              "price",
              "category",
              "deliveryTime",
            ],
            required: false,
          },
        ],
      });
    } catch (error) {
      console.error("Error while fetching buyer and vendors",error);
    }
    const vendorsJSON = vendors.map((v) => v.toJSON());
    const shortlisted = shortlistVendors(aiParsed, vendorsJSON, buyer.toJSON());
    console.log("shortlisted", shortlisted);
    try {
      await rfp.update(
        {
          aiParsedRequirements: aiParsed,
          shortlistedVendorsList: shortlisted,
          rfpStatus: "Shortlisted",
        },
        { returning: true }
      );
      await RfpVendor.bulkCreate(
        shortlisted.map((vendor) => ({
          rfpId: rfpId,
          vendorId: vendor.id,
          vendorScore: vendor.score,
          buyerId: rfp.toJSON().buyerId,
        }))
      );
    } catch (err) {
      console.error("Failed to save RFP:", err);
    }
  },
  {
    connection: { host: process.env.REDIS_HOST, port: 6379 },
  }
);
