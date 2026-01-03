import Rfp from "../models/rfp.js";
import Vendor from "../models/vendor.js";
import { rfpQueue } from "../queue/rfpQueue.js";

export async function createRFP(req) {
  const buyerId = req.user.id;
  const { title, requirements, expectedDelivery, budget, context } = req.body;

  const rfp = await Rfp.create({
    buyerId,
    rfpTitle: title,
    buyerExpectations: requirements,
    expectedDelivery,
    budgetRange: budget,
    additionalContext: context,
    submissionDate: new Date(),
    rfpStatus: "Pending",
  });
  // enqueue background job for AI parsing & vendor matching
  await rfpQueue.add("processRfp", { rfpId: rfp.toJSON().id });
  return rfp;
}

export async function reSubmitRFP(rfpId) {
  await rfpQueue.add("processRfp", { rfpId });
}

export async function getRFPByBuyerId(buyerId) {
  try {
    const rfps = await Rfp.findAll({
      where: {
        buyerId,
      },
      order: [["updatedAt", "DESC"]],
    });
    return rfps;
  } catch (error) {
    return error;
  }
}

export async function getMiniRFPByBuyerId(buyerId) {
  try {
    const rfps = await Rfp.findAll({
      where: {
        buyerId,
      },
      attributes: [
        "id",
        "rfpTitle",
        "buyerExpectations",
        "rfpStatus",
        "notificationSent",
      ],
      order: [["updatedAt", "DESC"]],
    });
    return rfps;
  } catch (error) {
    return error;
  }
}

export async function getRFPByBuyerIdWithVendors(buyerId, RfpId) {
  try {
    const rfps = await Rfp.findOne({
      where: { id: RfpId, buyerId },
      attributes: {
        exclude: ["shortlistedVendorsList"],
      },
      include: [
        {
          model: Vendor,
          as: "Vendors",
          through: {
            attributes: ["vendorScore", "notificationSent", "proposalAccepted"],
          },
          attributes: ["id", "vendorCompanyName", "mainProductService"],
        },
      ],
    });
    return rfps;
  } catch (error) {
    return error;
  }
}

export async function getRFPById(RfpId) {
  try {
    const rfp = await Rfp.findByPk(RfpId);
    return rfp;
  } catch (error) {
    return error;
  }
}
