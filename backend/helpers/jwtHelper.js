import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || "default_secret_key";

export function validateJWT(token) {
  try {
    const _ = jwt.verify(token, secretKey);
    return true;
  } catch (err) {
    return false;
  }
}

export function generateJWT(user) {
  const payload = {
    id: user.id,
    email: user.email || user.emailAddress,
    role: user.role,
  };


  const options = {
    expiresIn: "1h",
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
}