import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Vendors, VendorProducts } from "../../entities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import LoadingSpinner  from "../ui/LoadingSpinner";
import { getVendor } from "../../services/vendorApi";
import { getAllProducts } from "../../services/productApi";
import productImage from "../../assets/productImage.png";
import { useAuth } from "../../context/authContext";
import {useToast} from "../../context/toastContext";

export default function VendorDetailPage() {
  const { id, proposalAccepted } = useParams<{
    id: string;
    proposalAccepted?: "true" | "false";
  }>();
  const [vendor, setVendor] = useState<Vendors | null>(null);
  const [products, setProducts] = useState<VendorProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const { isVendor } = useAuth();
  const {addToast}= useToast()

  useEffect(() => {
    if (id) {
      loadVendorDetails();
    }
  }, [id]);

  const loadVendorDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const resp = await getVendor(id,proposalAccepted);
      if (!resp.success) {
        setLoading(false);
        return;
      }
      setVendor(resp.data);
      const productResp = await getAllProducts(id);
      if (productResp.success) {
        setProducts(productResp.data);
      }
    } catch (error) {
      addToast( "Something went wrong", "error");
      console.error(error);
    }
    setLoading(false);
  };

  const getPriceInNumber = (price: number) => {
    return Number(price).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <p className="font-paragraph text-base text-textprimary/60">
            Vendor not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {!isVendor && (
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 font-paragraph text-sm text-textprimary hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vendors
            </Link>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <Building2 className="w-16 h-16 text-primary" />
                <div>
                  <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-2">
                    {vendor.vendorCompanyName || "Unnamed Vendor"}
                  </h1>
                  {vendor.vendorId && (
                    <p className="font-paragraph text-base text-textprimary/60">
                      Vendor ID: {vendor.vendorId}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {vendor.isEmailVerified ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="font-paragraph text-sm text-primary">
                      Validated
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-textprimary/30" />
                    <span className="font-paragraph text-sm text-textprimary/60">
                      Not Validated
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vendor Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-secondary text-secondary-foreground p-8">
                <h2 className="font-heading text-2xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {vendor.emailAddress && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Email
                        </p>
                        <p className="font-paragraph text-sm">
                          {vendor.emailAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {vendor.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Phone
                        </p>
                        <p className="font-paragraph text-sm">
                          {vendor.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {vendor.state && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          State
                        </p>
                        <p className="font-paragraph text-sm">{vendor.state}</p>
                      </div>
                    </div>
                  )}
                  {vendor.establishedDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Established
                        </p>
                        <p className="font-paragraph text-sm">
                          {new Date(
                            vendor.establishedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {vendor.deliveryTimeframe && (
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Delivery Timeframe
                        </p>
                        <p className="font-paragraph text-sm">
                          {vendor.deliveryTimeframe}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {vendor.mainProductService && (
                <div className="border-2 border-textprimary/10 p-8">
                  <h2 className="font-heading text-2xl font-semibold text-textprimary mb-4">
                    Main Product/Service
                  </h2>
                  <p className="font-paragraph text-base text-textprimary/70">
                    {vendor.mainProductService}
                  </p>
                </div>
              )}

              {/* Products Section */}
              <div>
                <h2 className="font-heading text-2xl font-semibold text-textprimary mb-6">
                  Product Catalog
                </h2>
                {products && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border-2 border-textprimary/10 p-6 hover:border-primary transition-colors"
                      >
                        {
                          <img
                            src={productImage}
                            alt={product.productName || "Product image"}
                            className="w-full h-48 object-cover mb-4"
                          />
                        }
                        <h3 className="font-heading text-xl font-semibold text-textprimary mb-2">
                          {product.productName || "Unnamed Product"}
                        </h3>
                        {product.category && (
                          <p className="font-paragraph text-xs text-primary mb-3">
                            {product.category}
                          </p>
                        )}
                        {product.description && (
                          <p className="font-paragraph text-sm text-textprimary/70 mb-4">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <p className="font-heading text-lg font-semibold text-textprimary">
                              ${getPriceInNumber(product.price)}
                            </p>
                          )}
                          {product.deliveryTime && (
                            <p className="font-paragraph text-xs text-textprimary/60">
                              {product.deliveryTime}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-paragraph text-base text-textprimary/60">
                    No products available yet.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
