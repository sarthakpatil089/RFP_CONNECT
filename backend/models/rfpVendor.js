import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";

class RfpVendor extends Model {
  rfpId;
  vendorId;
  buyerId;
  notificationSent;
}

RfpVendor.init(
  {
    rfpId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "rfps", key: "id" },
    },
    vendorId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "vendors", key: "id" },
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "buyers", key: "id" },
      onDelete: "CASCADE",
    },
    vendorScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    notificationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proposalAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "RfpVendors",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["rfpId", "vendorId"],
      },
      {
        fields: ["buyerId"],
      },
    ],
  }
);
RfpVendor.associate = (models) => {
  console.log(models)
  RfpVendor.belongsTo(models.Rfp, { foreignKey: "rfpId" });
  RfpVendor.belongsTo(models.Vendor, { foreignKey: "vendorId" });
  // RfpVendor.belongsTo(models.Buyer, { foreignKey: "buyerId" });
};

export default RfpVendor;
