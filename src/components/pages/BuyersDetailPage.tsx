import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Buyers, BuyerRFPs } from "../../entities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { getBuyer } from "../../services/buyerApi";
import { getAllRFPsBelongToBuyer } from "../../services/rfpApi";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";

export default function BuyerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [buyer, setBuyer] = useState<Buyers | null>(null);
  const [rfps, setRfps] = useState<BuyerRFPs[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isVendor } = useAuth();

  const items: BuyerRFPs[] = [
    {
      id: "rfp_001",
      buyerId: "buyer_001",
      createdAt: new Date("2024-08-01T09:30:00Z"),
      updatedAt: new Date("2024-08-02T11:00:00Z"),
      rfpTitle: "SaaS-Based Task Management Platform",
      buyerExpectations:
        "Need a secure, multi-tenant task management web app with role-based access, real-time updates, and detailed reporting.",
      expectedDelivery: "3-4 months",
      budgetRange: "₹5-8 Lakhs",
      additionalContext: "Enterprise-grade security required",
      aiParsedRequirements: {
        summary:
          "Secure multi-tenant task management SaaS platform with RBAC and real-time updates.",
        businessDomain: "SaaS",
        primaryGoal:
          "Build a scalable task management platform for enterprise teams with real-time collaboration.",
        techStack: ["React", "Node.js", "WebSockets", "PostgreSQL", "JWT"],
        mustHaveFeatures: [
          "Multi-tenant architecture",
          "Role-based access control (RBAC)",
          "Real-time task updates",
          "JWT authentication",
          "Audit logs",
          "Analytics dashboard",
        ],
        niceToHaveFeatures: ["Mobile app", "AI task prioritization"],
        expectedDelivery: "3-4 months",
      },
      submissionDate: "2024-08-20",
      shortlistedVendorsList: [
        { id: "vnd_001", vendorName: "TechCorp Solutions" },
        { id: "vnd_004", vendorName: "DevOps Experts Pvt Ltd" },
      ],
      notificationSent: true,
      rfpStatus: "Shortlisted",
    },
    {
      id: "rfp_002",
      buyerId: "buyer_002",
      createdAt: new Date("2024-09-05T10:15:00Z"),
      updatedAt: new Date("2024-09-07T16:20:00Z"),
      rfpTitle: "Pan-India Logistics and Last-Mile Delivery",
      buyerExpectations:
        "Looking for a logistics partner to handle pan-India B2B deliveries with SLA tracking and proof-of-delivery.",
      expectedDelivery: "2-3 months",
      budgetRange: "₹15-25 Lakhs",
      additionalContext: "Integration with existing ERP system",
      aiParsedRequirements: {
        summary:
          "Pan-India B2B logistics solution with real-time tracking and SLA compliance.",
        businessDomain: "Logistics",
        primaryGoal:
          "Provide reliable nationwide B2B delivery with guaranteed SLAs and proof-of-delivery.",
        techStack: ["REST APIs", "GPS tracking", "Node.js", "MongoDB"],
        mustHaveFeatures: [
          "Nationwide coverage",
          "SLA-based delivery tracking",
          "Live shipment tracking",
          "Proof-of-delivery capture",
          "Integration-ready APIs",
        ],
        niceToHaveFeatures: ["Route optimization", "Predictive ETAs"],
        expectedDelivery: "2-3 months",
      },
      submissionDate: "2024-09-25",
      shortlistedVendorsList: [
        { id: "vnd_002", vendorName: "LogiSwift Nationwide" },
      ],
      notificationSent: false,
      rfpStatus: "Under Evaluation",
    },
    {
      id: "rfp_003",
      buyerId: "buyer_003",
      createdAt: new Date("2024-10-01T08:45:00Z"),
      updatedAt: new Date("2024-10-03T13:10:00Z"),
      rfpTitle: "Corporate Office Stationery Annual Rate Contract",
      buyerExpectations:
        "Require a single vendor for yearly supply of office stationery with fixed pricing and scheduled deliveries.",
      expectedDelivery: "Immediate",
      budgetRange: "₹2-3 Lakhs annually",
      additionalContext: "Pan-India offices",
      aiParsedRequirements: {
        summary:
          "Annual office stationery supply contract with scheduled deliveries.",
        businessDomain: "Office Supplies",
        primaryGoal:
          "Establish reliable yearly stationery supply with fixed pricing and timely deliveries.",
        techStack: [],
        mustHaveFeatures: [
          "Annual rate contract",
          "Bulk pricing structure",
          "Monthly scheduled deliveries",
          "Replacement policy",
          "GST-compliant invoicing",
        ],
        niceToHaveFeatures: ["Online ordering portal", "Inventory tracking"],
        expectedDelivery: "Immediate",
      },
      submissionDate: "2024-10-18",
      shortlistedVendorsList: [
        { id: "vnd_003", vendorName: "StationeryHub India" },
        { id: "vnd_005", vendorName: "OfficePro Supplies" },
      ],
      notificationSent: true,
      rfpStatus: "Pending",
    },
    {
      id: "rfp_004",
      buyerId: "buyer_004",
      createdAt: new Date("2024-10-15T12:00:00Z"),
      updatedAt: new Date("2024-10-16T09:30:00Z"),
      rfpTitle: "Healthy Snacks for Office Pantry",
      buyerExpectations:
        "Need regular supply of packaged healthy snacks for 200 employees across two office locations.",
      expectedDelivery: "Monthly",
      budgetRange: "₹50,000 monthly",
      additionalContext: "Mumbai & Bangalore offices",
      aiParsedRequirements: {
        summary: "Regular healthy snack supply for corporate office pantries.",
        businessDomain: "FMCG",
        primaryGoal:
          "Maintain healthy snack supply for 200 employees across dual locations.",
        techStack: [],
        mustHaveFeatures: [
          "Packaged healthy snacks",
          "Low-sugar options",
          "Monthly replenishment",
          "Dual-location delivery",
          "FSSAI-compliant products",
        ],
        niceToHaveFeatures: ["Custom branding", "Subscription model"],
        expectedDelivery: "Monthly",
      },
      submissionDate: "2024-10-30",
      shortlistedVendorsList: [
        { id: "vnd_004", vendorName: "HealthyBites Foods" },
      ],
      notificationSent: false,
      rfpStatus: "Pending",
    },
    {
      id: "rfp_005",
      buyerId: "buyer_005",
      createdAt: new Date("2024-11-01T07:20:00Z"),
      updatedAt: new Date("2024-11-05T10:05:00Z"),
      rfpTitle: "Rebranding and Corporate Identity Design",
      buyerExpectations:
        "Looking for an agency to redesign logo, brand guidelines, and marketing collaterals for a tech startup.",
      expectedDelivery: "6-8 weeks",
      budgetRange: "₹3-5 Lakhs",
      additionalContext: "Modern, minimal design preferred",
      aiParsedRequirements: {
        summary: "Complete corporate rebranding package for tech startup.",
        businessDomain: "Design",
        primaryGoal:
          "Create modern brand identity including logo, guidelines, and marketing assets.",
        techStack: ["Adobe Illustrator", "Figma"],
        mustHaveFeatures: [
          "Logo redesign",
          "Typography and color palette",
          "Brand book/guidelines",
          "Social media kit",
          "Print-ready stationery",
        ],
        niceToHaveFeatures: ["Website mockups", "Motion graphics"],
        expectedDelivery: "6-8 weeks",
      },
      submissionDate: "2024-11-25",
      shortlistedVendorsList: [
        { id: "vnd_005", vendorName: "PixelCraft Studio" },
      ],
      notificationSent: true,
      rfpStatus: "Closed",
    },
  ];

  useEffect(() => {
    if (id) {
      loadBuyerDetails();
    }
  }, [id]);

  const loadBuyerDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [buyerRes, rfpsRes] = await Promise.all([
        getBuyer(id),
        getAllRFPsBelongToBuyer(),
      ]);

      if (!buyerRes.success) {
        throw new Error("Failed to fetch buyer details");
      }
      setBuyer(buyerRes.data);

      if (!rfpsRes.success) {
        throw new Error("Failed to fetch RFP details");
      }
      setRfps([...rfpsRes.data, ...items]);
    } catch (error) {
      addToast("Failed to load buyer data", "error");
      console.error("Failed to load buyer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openRfp = (rfpId: string) => {
    navigate(`/rfp-matching/${rfpId}`, { replace: true });
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

  if (!buyer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <p className="font-paragraph text-base text-textprimary/60">
            Buyer not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {isVendor && (
            <Link
              to="/buyers"
              className="inline-flex items-center gap-2 font-paragraph text-sm text-textprimary hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Buyers
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
                <User className="w-16 h-16 text-primary" />
                <div>
                  <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-2">
                    {`${buyer.firstName} ${buyer.lastName}` || "Unnamed Buyer"}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {buyer.isEmailVerified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-paragraph text-sm text-primary">
                      Email Validated
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-textprimary/30" />
                    <span className="font-paragraph text-sm text-textprimary/60">
                      Email Not Validated
                    </span>
                  </div>
                )}
                {false ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-paragraph text-sm text-primary">
                      Phone Validated
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-textprimary/30" />
                    <span className="font-paragraph text-sm text-textprimary/60">
                      Phone Not Validated
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Buyer Information */}
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
                  {buyer.emailAddress && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Email
                        </p>
                        <p className="font-paragraph text-sm">
                          {buyer.emailAddress}
                        </p>
                      </div>
                    </div>
                  )}
                  {buyer.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Phone
                        </p>
                        <p className="font-paragraph text-sm">{buyer.phone}</p>
                      </div>
                    </div>
                  )}
                  {buyer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-paragraph text-xs text-secondary-foreground/60 mb-1">
                          Address
                        </p>
                        <p className="font-paragraph text-sm">
                          {buyer.address}, {buyer.city}, {buyer.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* RFPs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-semibold text-textprimary mb-6">
                  Submitted RFPs
                </h2>
                {rfps.length > 0 ? (
                  <div className="space-y-6">
                    {rfps.map((rfp) => (
                      <div
                        key={rfp.id}
                        className="border-2 border-textprimary/10 p-6 hover:border-primary transition-colors"
                        onClick={() => openRfp(rfp.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            <h3 className="font-heading text-xl font-semibold text-textprimary">
                              {rfp.rfpTitle || "Untitled RFP"}
                            </h3>
                          </div>
                          {rfp.rfpStatus && (
                            <span className="font-paragraph text-xs px-3 py-1 bg-primary/10 text-primary">
                              {rfp.rfpStatus}
                            </span>
                          )}
                        </div>

                        {rfp.buyerExpectations && (
                          <div className="mb-4">
                            <p className="font-paragraph text-sm font-semibold text-textprimary mb-2">
                              Buyer Expectations
                            </p>
                            <p className="font-paragraph text-sm text-textprimary/70">
                              {rfp.buyerExpectations}
                            </p>
                          </div>
                        )}

                        {rfp.aiParsedRequirements && (
                          <div className="mb-4 bg-secondary/5 p-4">
                            <p className="font-paragraph text-sm font-semibold text-textprimary mb-2">
                              AI Parsed Requirements
                            </p>
                            <p className="font-paragraph text-sm text-textprimary/70">
                              <strong>
                                {rfp.aiParsedRequirements.summary}
                              </strong>
                              <br />
                              <span className="text-xs text-textprimary/50">
                                Domain:{" "}
                                {rfp.aiParsedRequirements.businessDomain} |
                                Goal: {rfp.aiParsedRequirements.primaryGoal} |
                                Timeline:{" "}
                                {rfp.aiParsedRequirements.expectedDelivery}
                              </span>
                              {rfp.aiParsedRequirements.mustHaveFeatures
                                .length > 0 && (
                                <>
                                  <br />
                                  <strong>Must Have:</strong>{" "}
                                  {rfp.aiParsedRequirements.mustHaveFeatures.join(
                                    ", "
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        )}

                        {rfp.shortlistedVendorsList && (
                          <div className="mb-4">
                            <p className="font-paragraph text-sm font-semibold text-textprimary mb-2">
                              Shortlisted Vendors
                            </p>
                            <p className="font-paragraph text-sm text-textprimary/70">
                              {rfp.shortlistedVendorsList.map(
                                (vendor, ind, arr) => (
                                  <span key={vendor.id || ind}>
                                    {vendor.vendorName}
                                    {ind !== arr.length - 1 && <span>, </span>}
                                  </span>
                                )
                              )}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-textprimary/10">
                          {rfp.submissionDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-paragraph text-xs text-textprimary/60">
                                {new Date(
                                  rfp.submissionDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {rfp.notificationSent && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="font-paragraph text-xs text-primary">
                                Notifications Sent
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-paragraph text-base text-textprimary/60">
                    No RFPs submitted yet.
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
