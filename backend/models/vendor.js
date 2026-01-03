import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";

class Vendor extends Model {
  id;
  vendorName;
  emailAddress;
  mainProductService;
  passwordHash;
  isEmailVerified;
  emailVerifiedAt;
  status;
  createdAt;
  updatedAt;
}

Vendor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendorCompanyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mainProductService: {
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    establishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryTimeframe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING_VERIFICATION", "ACTIVE", "SUSPENDED"),
      allowNull: false,
      defaultValue: "PENDING_VERIFICATION",
    },
    onboardingCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    onboardingProgress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "vendors",
  }
);

Vendor.associate = (models) => {
  Vendor.hasMany(models.VendorProduct, { 
    foreignKey: 'vendorId', 
    as: 'products'  
  });
  Vendor.belongsToMany(models.Rfp, {
    through: models.RfpVendor,
    foreignKey: 'vendorId',
    otherKey: 'rfpId',
    as: 'Rfps'
  });
};

export default Vendor;
