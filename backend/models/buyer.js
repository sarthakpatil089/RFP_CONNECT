import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";

class Buyer extends Model {
  id;
  firstName;
  lastName;
  emailAddress;
  phone;
  address;
  city;
  state;
  postalCode;
  country;
  passwordHash;
  isEmailVerified;
  emailVerifiedAt;
  status;
  createdAt;
  updatedAt;
}

Buyer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"),
      allowNull: false,
      defaultValue: "PENDING_VERIFICATION",
    },
  },
  {
    sequelize,
    tableName: "buyers",
  }
);

export default Buyer;