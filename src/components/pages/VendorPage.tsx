import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Vendors } from "../../entities/index";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingSpinner  from "../ui/LoadingSpinner";
import { getVendors } from "../../services/vendorApi";
import { useToast } from "../../context/toastContext";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const {addToast}= useToast();

  const vendorData = [
    {
      id: "vnd_001",
      createdAt: new Date("2024-01-15T10:30:00Z"),
      updatedAt: new Date("2024-03-01T09:15:00Z"),
      vendorCompanyName: "Alpha Tech Solutions",
      vendorId: "ALP-TECH-001",
      phoneNumber: "+91-9876543210",
      emailAddress: "contact@alphatech.in",
      mainProductService: "Cloud infrastructure and DevOps services",
      deliveryTimeframe: "2–4 weeks",
      establishedDate: new Date("2016-05-20"),
      state: "Karnataka",
      isEmailVerified: true,
    },
    {
      id: "vnd_002",
      createdAt: new Date("2023-11-05T14:10:00Z"),
      updatedAt: new Date("2024-02-10T16:45:00Z"),
      vendorCompanyName: "Bright Logistics Pvt Ltd",
      vendorId: "BRG-LOG-014",
      phoneNumber: "+91-9123456780",
      emailAddress: "support@brightlogistics.com",
      mainProductService: "B2B logistics and last-mile delivery",
      deliveryTimeframe: "3–7 days",
      establishedDate: new Date("2012-08-10"),
      state: "Maharashtra",
      isEmailVerified: true,
    },
    {
      id: "vnd_003",
      createdAt: new Date("2024-04-01T08:00:00Z"),
      updatedAt: new Date("2024-04-15T11:20:00Z"),
      vendorCompanyName: "Nova Office Supplies",
      vendorId: "NOVA-OFF-203",
      phoneNumber: "+91-9988776655",
      emailAddress: "sales@novaoffice.in",
      mainProductService: "Office stationery and peripherals",
      deliveryTimeframe: "5–10 days",
      establishedDate: new Date("2018-01-05"),
      state: "Delhi",
      isEmailVerified: false,
    },
    {
      id: "vnd_004",
      createdAt: new Date("2022-09-12T12:30:00Z"),
      updatedAt: new Date("2024-01-22T10:05:00Z"),
      vendorCompanyName: "GreenLeaf Foods",
      vendorId: "GRN-FOOD-087",
      phoneNumber: "+91-9012345678",
      emailAddress: "orders@greenleaffoods.com",
      mainProductService: "Packaged organic food products",
      deliveryTimeframe: "7–12 days",
      establishedDate: new Date("2015-03-18"),
      state: "Uttar Pradesh",
      isEmailVerified: true,
    },
    {
      id: "vnd_005",
      createdAt: new Date("2024-06-20T07:45:00Z"),
      updatedAt: new Date("2024-06-25T09:00:00Z"),
      vendorCompanyName: "Pixel Print Studio",
      vendorId: "PXL-PRT-059",
      phoneNumber: "+91-9765432109",
      emailAddress: "hello@pixelprintstudio.com",
      mainProductService: "Corporate printing and branding",
      deliveryTimeframe: "10–15 days",
      establishedDate: new Date("2019-11-02"),
      state: "Tamil Nadu",
      isEmailVerified: false,
    },
  ];

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const { data, success } = await getVendors();
      if (!success) {
        throw new Error("Failed to fetch vendors");
      }
      setVendors([...data, ...vendorData]);
    } catch (error) {
      addToast("Error fetching vendors","success")
      console.error("Error fetching vendors:", error);
    }
    setLoading(false);
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.vendorCompanyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vendor.mainProductService
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vendor.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Registered Vendors
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Browse our network of verified vendors and their service
              offerings.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textprimary/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by vendor name, product, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-textprimary/20 font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={`/vendors/${vendor.id}`}
                    className="block border-2 border-textprimary/10 p-8 hover:border-primary transition-colors h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Building2 className="w-10 h-10 text-primary" />
                        <div>
                          <h2 className="font-heading text-2xl font-semibold text-textprimary">
                            {vendor.vendorCompanyName || "Unnamed Vendor"}
                          </h2>
                          {vendor.vendorId && (
                            <p className="font-paragraph text-sm text-textprimary/60">
                              ID: {vendor.vendorId}
                            </p>
                          )}
                        </div>
                      </div>
                      {vendor.isEmailVerified ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <XCircle className="w-6 h-6 text-textprimary/30" />
                      )}
                    </div>

                    {vendor.mainProductService && (
                      <div className="mb-6">
                        <p className="font-paragraph text-base text-textprimary font-semibold mb-2">
                          Main Product/Service
                        </p>
                        <p className="font-paragraph text-sm text-textprimary/70">
                          {vendor.mainProductService}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {vendor.emailAddress && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {vendor.emailAddress}
                          </span>
                        </div>
                      )}
                      {vendor.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {vendor.phoneNumber}
                          </span>
                        </div>
                      )}
                      {vendor.state && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {vendor.state}
                          </span>
                        </div>
                      )}
                      {vendor.deliveryTimeframe && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            Delivery: {vendor.deliveryTimeframe}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredVendors.length === 0 && (
            <div className="text-center py-24">
              <p className="font-paragraph text-base text-textprimary/60">
                No vendors found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
