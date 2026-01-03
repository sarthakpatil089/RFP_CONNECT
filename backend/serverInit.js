import { sequelize } from "./models/index.js";
import EmailVerificationToken from "./models/emailVerificationToken.js";
import Buyer from "./models/buyer.js";
import VendorProduct from "./models/product.js";
import Rfp from "./models/rfp.js";
import Vendor from "./models/vendor.js";
import RfpVendor from "./models/rfpVendor.js";

Vendor.associate({ VendorProduct, Rfp, RfpVendor });
VendorProduct.associate({ Vendor });
Rfp.associate({ Vendor, RfpVendor });

RfpVendor.associate({ Rfp, Vendor });

export const startServer = async (port, app) => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected");
    
    await sequelize.sync({ alter: true });
    console.log("Database synced (tables created/updated)");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("DB connection/sync error:", err);
    process.exit(1);
  }
};
