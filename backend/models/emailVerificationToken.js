import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";
import Vendor from "./vendor.js";
import Buyer from "./buyer.js";

class EmailVerificationToken extends Model {
  id;
  userId;
  token;
  expiresAt;
  usedAt;
  createdAt;
  updatedAt;
}

EmailVerificationToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "email_verification_tokens",
  }
);

// associations
Vendor.hasMany(EmailVerificationToken, { foreignKey: "vendorId" });
EmailVerificationToken.belongsTo(Vendor, { foreignKey: "vendorId" });

Buyer.hasMany(EmailVerificationToken, { foreignKey: "buyerId" });
EmailVerificationToken.belongsTo(Vendor, { foreignKey: "buyerId" });

export default EmailVerificationToken;
