import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Building2,
  CheckCircle,
  CircleAlert,
  SquareUser,
  MailCheck,
  MailPlus,
  Users,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { BuyerRFPs, miniRFP, SelectedVendors } from "../../entities";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  getAllRFPsMiniBelongToBuyer,
  getRFPById,
  reSubmitRfp,
  sendVendorMailForProposal,
} from "../../services/rfpApi";
import { useToast } from "../../context/toastContext";

export default function RFPMatchingPage() {
  const { id } = useParams<{ id: string }>();
  const [rfps, setRfps] = useState<miniRFP[]>([]);
  const [vendors, setVendors] = useState<SelectedVendors[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRFP, setSelectedRFP] = useState<BuyerRFPs | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedRfp(id);
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, success } = await getAllRFPsMiniBelongToBuyer();
      if (!success) {
        throw new Error("Encounter error while fetching rfps");
      }
      setRfps(data);
    } catch (error) {
      console.error("Error Encountered: ", error);
      addToast("An error encountered while fetching data", "error");
    }
    setLoading(false);
  };

  const getRfpById = async (id: string) => {
    const { data, success } = await getRFPById(id);
    if (!success) {
      throw new Error("Encounter error while fetching rfp");
    }
    setSelectedRFP(data);
    setVendors(data.Vendors || []);
  };

  const setSelectedRfp = async (rfpId: string) => {
    try {
      await getRfpById(rfpId);
    } catch (error) {
      addToast("An error encountered while fetching rfp", "error");
      console.error("Error encountered: ", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };
  const reSubmitRFP = async (rfpId: string) => {
    setLoading(true);
    try {
      setRfps((prev) =>
        prev.map((rfp) =>
          rfp.id === rfpId ? { ...rfp, rfpStatus: "Re-processing..." } : rfp
        )
      );
      await reSubmitRfp(rfpId);
      addToast("RFP re-submitted successfully!", "success");
      navigate("/rfp-matching/" + rfpId, { replace: true });
      setSelectedRfp(rfpId);
    } catch (error) {
      addToast("An error encountered while resubmitting rfp", "error");
      console.error("Error encountered: ", error);
    } finally {
      setLoading(false);
    }
  };

  const openVendorDetail = (vendorId: string, proposalAccepted: boolean) => {
    navigate(`/vendors/${vendorId}/${proposalAccepted}`, { replace: true });
  };

  const sendEmailToVendor = async (vendorId: string, rfpId: string) => {
    try {
      await sendVendorMailForProposal(vendorId, rfpId);
    } catch (error) {
      addToast("An error encountered while sending mail", "error");
      console.log(error);
    }
    // will update later by using redux
    setVendors((prev) =>
      prev.map((vendor) => {
        const rfpVendor = vendor.RfpVendor;
        return vendor.id === vendorId
          ? {
              ...vendor,
              RfpVendor: {
                notificationSent: true,
                score: rfpVendor?.score,
                proposalAccepted: rfpVendor?.proposalAccepted,
              },
            }
          : vendor;
      })
    );
  };

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
              RFP Matching System
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Review submitted RFPs, view AI-parsed requirements, and manage
              vendor notifications.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* RFPs List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-heading text-2xl font-semibold text-textprimary mb-6">
                  Active RFPs
                </h2>
                <div className="space-y-4">
                  {rfps.map((rfp) => (
                    <div
                      key={rfp.id}
                      onClick={() => setSelectedRfp(rfp.id)}
                      className={`border-2 p-6 cursor-pointer transition-colors ${
                        selectedRFP?.id === rfp.id
                          ? "border-primary bg-primary/5"
                          : "border-textprimary/10 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-primary" />
                          <h3 className="font-heading text-lg font-semibold text-textprimary">
                            {rfp.rfpTitle || "Untitled RFP"}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {rfp.notificationSent ? (
                            <div title="Notified">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          ) : (
                            <div title="Not Notified">
                              <CircleAlert className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                      {rfp.rfpStatus && (
                        <span className="font-paragraph text-xs px-3 py-1 bg-textprimary/10 text-textprimary">
                          {rfp.rfpStatus}
                        </span>
                      )}
                      {rfp.buyerExpectations && (
                        <p className="font-paragraph text-sm text-textprimary/70 mt-3 line-clamp-2">
                          {rfp.buyerExpectations}
                        </p>
                      )}
                    </div>
                  ))}
                  {rfps.length === 0 && (
                    <p className="font-paragraph text-base text-textprimary/60 text-center py-12">
                      No RFPs submitted yet.
                    </p>
                  )}
                </div>
              </motion.div>

              {/* RFP Details & Vendor Matching */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {selectedRFP ? (
                  <div className="space-y-6">
                    <div className="bg-secondary text-secondary-foreground p-8">
                      <h2 className="font-heading text-2xl font-semibold mb-6">
                        RFP Details
                      </h2>

                      {selectedRFP.buyerExpectations && (
                        <div className="mb-6">
                          <p className="font-paragraph text-sm font-semibold mb-2">
                            Buyer Expectations
                          </p>
                          <p className="font-paragraph text-sm text-secondary-foreground/80">
                            {selectedRFP.buyerExpectations}
                          </p>
                        </div>
                      )}

                      {/* AI Parsed Requirements */}
                      {selectedRFP.aiParsedRequirements && (
                        <div className="mb-6">
                          <p className="font-paragraph text-sm font-semibold mb-2">
                            AI Parsed Requirements
                          </p>
                          <div className="font-paragraph text-sm text-secondary-foreground/80 space-y-3 p-4 bg-secondary/20 rounded-lg">
                            <div>
                              <strong>Summary:</strong>{" "}
                              {selectedRFP.aiParsedRequirements.summary}
                            </div>
                            <div>
                              <strong>Domain:</strong>{" "}
                              {selectedRFP.aiParsedRequirements.businessDomain}
                            </div>
                            <div>
                              <strong>Goal:</strong>{" "}
                              {selectedRFP.aiParsedRequirements.primaryGoal}
                            </div>

                            {selectedRFP.aiParsedRequirements.techStack.length >
                              0 && (
                              <div>
                                <strong>Tech:</strong>{" "}
                                {selectedRFP.aiParsedRequirements.techStack.join(
                                  ", "
                                )}
                              </div>
                            )}

                            <div>
                              <strong>Timeline:</strong>{" "}
                              {
                                selectedRFP.aiParsedRequirements
                                  .expectedDelivery
                              }
                            </div>

                            {selectedRFP.aiParsedRequirements.mustHaveFeatures
                              .length > 0 && (
                              <div>
                                <strong>Must Have:</strong>
                                <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
                                  {selectedRFP.aiParsedRequirements.mustHaveFeatures.map(
                                    (feature, idx) => (
                                      <li key={idx}>{feature}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Shortlisted Vendors */}
                      {vendors.length > 0 && (
                        <div className="mb-6">
                          <p className="font-paragraph text-sm font-semibold mb-2">
                            Shortlisted Vendors ({vendors.length})
                          </p>
                          <div className="flex flex-wrap gap-2 p-4 bg-secondary/20 rounded-lg">
                            {vendors.map((vendor, idx) => (
                              <span
                                key={vendor.id || idx}
                                className="px-3 py-1 bg-white text-sm font-medium text-textprimary rounded-full border shadow-sm"
                              >
                                {vendor.vendorCompanyName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRFP.submissionDate && (
                        <div className="mb-6">
                          <p className="font-paragraph text-sm font-semibold mb-2">
                            Submission Date
                          </p>
                          <p className="font-paragraph text-sm text-secondary-foreground/80">
                            {new Date(
                              selectedRFP.submissionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedRFP.rfpStatus === "Pending" && (
                        <div className="pt-6 border-t border-secondary-foreground/20">
                          {/* ✅ Message */}
                          <p className="font-paragraph text-sm text-secondary-foreground/70 mb-4 text-center">
                            Try re-submitting the RFP to get AI parsing again
                            and find better vendor matches.
                          </p>

                          <button
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={() => reSubmitRFP(selectedRFP.id)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m0 0A7 7 0 0114 9.5a4.25 4.25 0 01-2.662.788m0 0A11.946 11.946 0 0121 12.049"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4H2m10 5v5m0 0V9m0 5H8"
                              />
                            </svg>
                            Re-submit RFP
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Matched Vendors */}
                    {vendors.length !== 0 ? (
                      <div className="border-2 border-textprimary/10 p-8">
                        <h3 className="font-heading text-xl font-semibold text-textprimary mb-6">
                          Matched Vendors
                        </h3>
                        <div className="space-y-4">
                          {vendors.slice(0, 3).map((vendor) => (
                            <div
                              key={vendor.id}
                              className="flex items-center gap-4 p-4 bg-textprimary/5 rounded-lg"
                            >
                              <button
                                className="flex items-center justify-between gap-4 p-4 hover:bg-textprimary/20 rounded-lg flex-1"
                                title={`Know More About ${vendor.vendorCompanyName}`}
                                onClick={() => {
                                  openVendorDetail(
                                    vendor.id,
                                    vendor.RfpVendor.proposalAccepted
                                  );
                                }}
                              >
                                <div className="flex items-center gap-4">
                                  <Building2 className="w-8 h-8 text-primary" />
                                  <div>
                                    <p className="font-heading text-base font-semibold text-textprimary">
                                      {vendor.vendorCompanyName ||
                                        "Unnamed Vendor"}
                                    </p>
                                    <p className="font-paragraph text-sm text-textprimary/60">
                                      {vendor.mainProductService ||
                                        "No description"}
                                    </p>
                                  </div>
                                </div>
                                {vendor.RfpVendor.proposalAccepted && (
                                  <div>
                                    <SquareUser className="w-5 h-5 text-textprimary/70 group-hover:text-primary" />
                                  </div>
                                )}
                              </button>

                              {/* ✅ Send Mail Button */}
                              {vendor.RfpVendor.notificationSent ? (
                                <div
                                  className="p-2 hover:bg-textprimary/20 rounded-lg transition-all duration-200 hover:scale-105 group"
                                  title="Email Sent"
                                >
                                  <MailCheck className="w-5 h-5 text-textprimary/70 group-hover:text-primary" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    sendEmailToVendor(
                                      vendor.id,
                                      selectedRFP.id
                                    );
                                  }}
                                  className="p-2 hover:bg-textprimary/20 rounded-lg transition-all duration-200 hover:scale-105 group"
                                  title="Send Email"
                                >
                                  <MailPlus className="w-5 h-5 text-textprimary/70 group-hover:text-primary" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-textprimary/10 p-8  bg-gradient-to-br from-textprimary/5 to-transparent">
                        <div className="text-center py-12 px-6">
                          <div className="w-20 h-20 mx-auto mb-6 p-5 bg-textprimary/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-10 h-10 text-textprimary/50" />
                          </div>
                          <h3 className="font-heading text-xl font-semibold text-textprimary mb-3">
                            No Vendors Found
                          </h3>
                          <p className="font-paragraph text-textprimary/70 max-w-md mx-auto mb-6 leading-relaxed">
                            Stay connected! We'll notify you as soon as vendors
                            match your requirements.
                          </p>
                          <div className="w-24 h-24 border-2 border-dashed border-textprimary/20 rounded-full animate-pulse mx-auto mb-4" />
                          <p className="text-xs text-textprimary/50 font-paragraph">
                            Notifications enabled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full border-2 border-textprimary/10 p-12">
                    <div className="text-center">
                      <Search className="w-16 h-16 text-textprimary/20 mx-auto mb-4" />
                      <p className="font-paragraph text-base text-textprimary/60">
                        Select an RFP to view details and manage vendor matching
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
