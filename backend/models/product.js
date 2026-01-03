import { DataTypes, Model } from "sequelize";
import sequelize from "./index.js";
import Vendor from "./vendor.js";

class VendorProduct extends Model {
  id;
  vendorId;
  productName;
  description;
  productImage;
  price;
  category;
  deliveryTime;
  productURL;
  createdAt;
  updatedAt;
}

VendorProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Vendor,
        key: "id",
      },
      onDelete: "CASCADE", 
      onUpdate: "CASCADE", 
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "vendor_products",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["vendorId", "productName"],
      },
    ],
  }
);

// Define association
// VendorProduct.belongsTo(Vendor, { foreignKey: "vendorId" });
// Vendor.hasMany(VendorProduct, { foreignKey: "vendorId" });
VendorProduct.associate = (models) => {
  VendorProduct.belongsTo(models.Vendor, { 
    foreignKey: "vendorId",
    as: 'vendor'  
  });
};

export default VendorProduct;
