import RfpVendor from "../models/rfpVendor.js";
import { sendProposalResponseToBuyer } from "../helpers/EmailHelper.js";

//end point for the response from buyer
export async function responseToBuyerProposalByVendor(
  rfpId,
  vendorId,
  isAccepted
) {
  try {
    await RfpVendor.update(
      { proposalAccepted: isAccepted },
      { where: { rfpId, vendorId } }
    );
    await sendProposalResponseToBuyer(isAccepted, rfpId, vendorId);
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function getBuyerIdForWhichVendorHasAccpetedPropsal(vendorId) {
  const buyerIds = await RfpVendor.findAll({
    where: {
      vendorId: vendorId,
      proposalAccepted: true,
    },
    attributes: ["buyerId"],
    raw: true,
  });
  return buyerIds.map(row => row.buyerId);
}

export async function getVendorIdForWhichVendorHasAccpetedPropsal(buyerId) {
  const vendorIds = await RfpVendor.findAll({
    where: {
      buyerId: buyerId,
      proposalAccepted: true,
    },
    attributes: ["vendorId"],
    raw: true,
  });
  return vendorIds.map(row => row.vendorId);
}
