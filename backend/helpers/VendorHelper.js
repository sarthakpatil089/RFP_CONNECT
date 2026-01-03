import bcrypt from "bcrypt";
import crypto from "crypto";

import { sequelize } from "../models/index.js";
import { generateJWT } from "./jwtHelper.js";
import Vendor from "../models/vendor.js";
import EmailVerificationToken from "../models/emailVerificationToken.js";
import { sendVerificationEmail } from "./EmailHelper.js";
import RfpVendor from "../models/rfpVendor.js";
import { getVendorIdForWhichVendorHasAccpetedPropsal } from "./rfpVendorHelper.js";

export async function getVendorMailById(vendorId) {
  const vendor = await Vendor.findOne({
    where: { id: vendorId },
    attributes: ["emailAddress", "vendorCompanyName"],
  });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return {
    emailAddress: vendor.toJSON().emailAddress,
    vendorCompanyName: vendor.toJSON().vendorCompanyName,
  };
}

export async function signupHelper({
  vendorCompanyName,
  emailAddress,
  mainProductService,
  password,
}) {
  try {
    const existingUser = await Vendor.findOne({ where: { emailAddress } });
    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await Vendor.create({
      vendorCompanyName,
      emailAddress,
      mainProductService,
      passwordHash: password_hash,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await EmailVerificationToken.create({
      vendorId: newUser.toJSON().id,
      token,
      expiresAt,
      userId: newUser.toJSON().id,
    });

    await sendVerificationEmail(
      emailAddress,
      token,
      newUser.toJSON().id,
      "vendor"
    );

    const jwtToken = generateJWT({
      id: newUser.toJSON().id,
      email: emailAddress,
      role: "VENDOR",
    });
    return {
      success: true,
      message: "User created. Please check email for verification.",
      token: jwtToken,
    };
  } catch (error) {
    console.error("Error in signupHelper:", error);
    throw error;
  }
}

export async function getVendorByid(vendorId, proposal) {
  try {
    let vendor;
    if (proposal === "true") {
      const vendorRfp = await RfpVendor.findOne({
        where: {
          vendorId,
          proposalAccepted: proposal,
        },
      });
      if (vendorRfp) {
        vendor = await Vendor.findByPk(vendorId, {
          attributes: {
            exclude: ["passwordHash"],
          },
        });
        return {
          success: true,
          data: vendor.toJSON(),
        };
      }
    }
    vendor = await Vendor.findByPk(vendorId, {
      attributes: {
        exclude: ["passwordHash"],
        include: [
          [
            sequelize.literal(`
          CASE 
            WHEN "phoneNumber" IS NOT NULL AND LENGTH("phoneNumber") >= 10
            THEN CONCAT('xxxxxx', SUBSTRING("phoneNumber" FROM 7))
            ELSE COALESCE("phoneNumber", '')
          END
        `),
            "phoneNumber",
          ],
          [
            sequelize.literal(`
          CASE 
            WHEN "emailAddress" IS NOT NULL AND "emailAddress" != ''
            THEN 
              CONCAT(
                SUBSTRING("emailAddress" FROM 1 FOR 2),
                'xxxxx',
                SUBSTRING("emailAddress" FROM POSITION('@' IN "emailAddress"))
              )
            ELSE COALESCE("emailAddress", '')
          END
        `),
            "emailAddress",
          ],
        ],
      },
    });

    if (!vendor) {
      return { success: false, error: "Vendor not found." };
    }
    return {
      success: true,
      data: { ...vendor.toJSON(), passwordHash: undefined },
    };
  } catch (error) {
    return error;
  }
}

export async function vendorOnboardingStep1Helper(vendorId, data) {
  try {
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return { success: false, error: "Vendor not found." };
    }
    await vendor.update(data);
    return { success: true, message: "Vendor onboarding step 1 completed." };
  } catch (error) {
    return error;
  }
}

export async function getAllVendors(userId) {
  try {
    const acceptedVendorIds = await getVendorIdForWhichVendorHasAccpetedPropsal(
      userId
    );
    const acceptedVendorIdSet = new Set(acceptedVendorIds);

    const vendors = await Vendor.findAll({
      attributes: {
        exclude: ["passwordHash"],
      },
    });

    const result = vendors.map((vendor) => {
      const plain = vendor.get({ plain: true });
      const isAccepted = acceptedVendorIdSet.has(plain.id);

      if (isAccepted) {
        return plain;
      }

      const maskedPhoneNumber = plain.phoneNumber
        ? "xxxxxx" + plain.phoneNumber.slice(-4)
        : plain.phoneNumber || "";

      const email = plain.emailAddress || "";
      let maskedEmail = email;
      if (email && email.includes("@")) {
        const atIndex = email.indexOf("@");
        const prefix = email.slice(0, 2);
        const domain = email.slice(atIndex);
        maskedEmail = `${prefix}xxxxx${domain}`;
      }

      return {
        ...plain,
        phoneNumber: maskedPhoneNumber,
        emailAddress: maskedEmail,
      };
    });

    return { success: true, data: result };
  } catch (error) {
    return error;
  }
}
