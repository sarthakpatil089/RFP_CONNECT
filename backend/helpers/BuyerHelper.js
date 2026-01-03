import bcrypt from "bcrypt";
import crypto from "crypto";

import Buyer from "../models/buyer.js";
import EmailVerificationToken from "../models/emailVerificationToken.js";
import { generateJWT } from "./jwtHelper.js";
import { sendVerificationEmail } from "../helpers/EmailHelper.js";
import { getBuyerIdForWhichVendorHasAccpetedPropsal } from "../helpers/rfpVendorHelper.js";

export async function signupHelper(payload) {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      addressLine,
      city,
      state,
      postalCode,
      country,
      password,
    } = payload;
    const existingUser = await Buyer.findOne({ where: { emailAddress } });
    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await Buyer.create({
      firstName,
      lastName,
      phone: phoneNumber,
      address: addressLine,
      emailAddress,
      city,
      state,
      postalCode,
      country,
      passwordHash: password_hash,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await EmailVerificationToken.create({
      userId: newUser.toJSON().id,
      token,
      expiresAt,
      BuyerId: newUser.toJSON().id,
    });

    await sendVerificationEmail(
      emailAddress,
      token,
      newUser.toJSON().id,
      "buyer"
    );

    const jwtToken = generateJWT(newUser);
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

export async function getAllBuyers(userId) {
  try {
    const acceptedBuyerIds = await getBuyerIdForWhichVendorHasAccpetedPropsal(
      userId
    );
    const acceptedBuyerIdSet = new Set(acceptedBuyerIds);

    const buyers = await Buyer.findAll({
      attributes: {
        exclude: ["passwordHash"],
      },
    });

    const result = buyers.map((buyer) => {
      const plain = buyer.get({ plain: true });
      const isAccepted = acceptedBuyerIdSet.has(plain.id);

      if (isAccepted) {
        return plain;
      }

      const maskedPhone = plain.phone
        ? "xxxxxx" + plain.phone.slice(-4)
        : plain.phone || "";

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
        phone: maskedPhone,
        emailAddress: maskedEmail,
      };
    });

    return { success: true, data: result };
  } catch (error) {
    return error;
  }
}

export async function getBuyerById(id, getUnMaskedData) {
  try {
    const buyer = await Buyer.findOne({
      where: { id },
      attributes: {
        exclude: ["passwordHash"],
      },
    });

    if (!buyer) {
      return { success: true, data: null };
    }

    const plain = buyer.get({ plain: true });

    if (getUnMaskedData) {
      return { success: true, data: plain };
    }

    const maskedPhone =
      plain.phone && plain.phone.length >= 10
        ? "xxxxxx" + plain.phone.slice(-4)
        : plain.phone || "";

    const email = plain.emailAddress || "";
    let maskedEmail = email;
    if (email && email.includes("@")) {
      const atIndex = email.indexOf("@");
      const prefix = email.slice(0, 2);
      const domain = email.slice(atIndex);
      maskedEmail = `${prefix}xxxxx${domain}`;
    }

    const maskedData = {
      ...plain,
      phone: maskedPhone,
      emailAddress: maskedEmail,
    };

    return { success: true, data: maskedData };
  } catch (error) {
    return error;
  }
}
