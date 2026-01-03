import Buyer from "../models/buyer.js";
import Vendor from "../models/vendor.js";
import bcrypt from "bcrypt";
import { generateJWT } from "./jwtHelper.js";

async function buyerLogin({ email, password }) {
  try {
    const buyer = await Buyer.findOne({
      where: { emailAddress: email, isEmailVerified: true },
    });
    if (!buyer) {
      throw new Error("Invalid email or unverified account");
    }
    const passwordHash = buyer.getDataValue("passwordHash");
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = generateJWT({
      id: buyer.toJSON().id,
      email: buyer.toJSON().emailAddress,
      role: "BUYER",
    });
    const buyerJSON = buyer.toJSON();
    return {
      id: buyerJSON.id,
      firstName: buyerJSON.firstName,
      lastName: buyerJSON.lastName,
      email: buyerJSON.emailAddress,
      token,
    };
  } catch (error) {
    return error;
  }
}

async function vendorLogin({ email, password }) {
  try {
    const vendor = await Vendor.findOne({
      where: { emailAddress: email, isEmailVerified: true },
    });
    if (!vendor) {
      throw Error("Invalid email or unverified account");
    }

    const passwordHash = vendor.getDataValue("passwordHash");

    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw Error("Invalid password");
    }
    const token = generateJWT({
      id: vendor.toJSON().id,
      email: vendor.toJSON().emailAddress,
      role: "VENDOR",
    });
    const vendorJSON = vendor.toJSON();
    return {
      ...vendorJSON,
      token,
      passwordHash: undefined,
    };
  } catch (error) {
    return error;
  }
}

export async function loginHelper({ role, email, password }) {
  if (role === "BUYER") {
    return await buyerLogin({ email, password });
  } else {
    return await vendorLogin({ email, password });
  }
}
