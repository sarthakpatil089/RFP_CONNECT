import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";

class Rfp extends Model {
  id;
  buyerId;
  rfpTitle;
  buyerExpectations;
  expectedDelivery;
  budgetRange;
  additionalContext;
  aiParsedRequirements;
  shortlistedVendorsList;
  rfpStatus;
  submissionDate;
  createdAt;
  updatedAt;
}

Rfp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Buyer input
    rfpTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyerExpectations: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expectedDelivery: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budgetRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalContext: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // AI + matching fields
    aiParsedRequirements: {
      type: DataTypes.JSON, // stores ParsedRfp JSON
      allowNull: true,
    },
    shortlistedVendorsList: {
      type: DataTypes.JSON, // e.g. ["vnd_001","vnd_004"]
      allowNull: true,
    },
    rfpStatus: {
      type: DataTypes.ENUM("Pending", "Parsed", "Shortlisted", "Notified"),
      allowNull: false,
      defaultValue: "Pending",
    },
    notificationSent: {
      type: DataTypes.BOOLEAN, // True only if notification is sent to any one of the vendors
      defaultValue: false,
    },
    submissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "rfps",
    timestamps: true, 
  }
);

Rfp.associate = (models) => {
  Rfp.belongsToMany(models.Vendor, {
    through: models.RfpVendor,  
    foreignKey: 'rfpId',
    otherKey: 'vendorId',
    as: 'Vendors'
  });
};

export default Rfp;
