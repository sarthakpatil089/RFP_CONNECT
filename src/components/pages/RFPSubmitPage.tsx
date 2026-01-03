import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Zap, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { submitRFP } from "../../services/rfpApi";
import { useToast } from "../../context/toastContext";

export interface RfpFormState {
  title: string;
  requirements: string;
  expectedDelivery: string;
  budget: string;
  context: string;
}

export default function RFPSubmitPage() {
  const [formData, setFormData] = useState<RfpFormState>({
    title: "",
    requirements: "",
    expectedDelivery: "",
    budget: "",
    context: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToast();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Project title is required.";
    if (!formData.requirements.trim())
      return "Requirements & expectations are required.";
    if (!formData.expectedDelivery)
      return "Expected delivery timeline is required.";
    if (!formData.budget) return "Budget is required.";
    if (!formData.context) return "Context is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validate();
    if (validationError) {
      addToast(validationError, "error");
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const resp = await submitRFP(formData);
      if (resp.success) {
        setSuccessMessage(
          `Your RFP has been submitted. Id: ${resp.rfpId} We are matching vendors now.`
        );
        setFormData({
          title: "",
          requirements: "",
          expectedDelivery: "",
          budget: "",
          context: "",
        });
      } else {
        throw new Error("Failed to submit RFP. Please try again.");
      }
      addToast("RFP submitted successfully", "success");
      setTimeout(() => {
        navigate(`/rfp-matching/${resp.rfpId}`, { replace: true });
      }, 400);
    } catch (err: any) {
      addToast(
        err.message || "Failed to submit RFP. Please try again.",
        "error"
      );
      setErrorMessage(err.message || "Failed to submit RFP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Submit Your RFP
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Describe your requirements in natural language. Our AI will parse
              your expectations and match you with qualified vendors.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-2 border-textprimary/10 p-6"
            >
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                Natural Language Input
              </h3>
              <p className="font-paragraph text-sm text-textprimary/70">
                Write your requirements as you would explain them to a
                colleague.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-2 border-textprimary/10 p-6"
            >
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                AI Processing
              </h3>
              <p className="font-paragraph text-sm text-textprimary/70">
                Our system analyzes and structures your requirements
                automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-2 border-textprimary/10 p-6"
            >
              <Bell className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                Vendor Notifications
              </h3>
              <p className="font-paragraph text-sm text-textprimary/70">
                Shortlisted vendors receive instant email notifications.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
          >
            <h2 className="font-heading text-3xl font-bold mb-4">
              Submit Your Requirements
            </h2>
            <p className="font-paragraph text-sm text-textprimary/70 mb-8 max-w-3xl">
              Please provide your requirements in natural language. Be as
              detailed as possible so we can understand your expectations and
              expected delivery.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., End-to-end CRM implementation for sales team"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Requirements / Expectations */}
              <div>
                <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                  Requirements & Expectations *
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your current setup, desired outcome, key features, integrations, performance expectations, constraints, etc."
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-vertical"
                  required
                />
              </div>

              {/* Expected delivery + budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                    Expected Delivery Timeline *
                  </label>
                  <select
                    name="expectedDelivery"
                    value={formData.expectedDelivery}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select expected delivery</option>
                    <option value="2-4 weeks">2–4 weeks</option>
                    <option value="1-2 months">1–2 months</option>
                    <option value="3-6 months">3–6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                    Budget Range *
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="E.g., ₹5–10L, $10k–$20k"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Extra context */}
              <div>
                <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                  Additional Context *
                </label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share any preferred technologies, constraints, or vendor expectations."
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-vertical"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-heading text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "{ Submit RFP → }"}
                </button>
              </div>
            </form>
            {/* Messages */}
            {errorMessage && (
              <div className="mb-4 mt-4 p-3 border border-destructive bg-destructive/10 rounded">
                <p className="font-paragraph text-sm text-destructive">
                  {errorMessage}
                </p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 mt-4 p-3 border border-green-500 bg-green-100 rounded">
                <p className="font-paragraph text-sm text-green-700">
                  {successMessage}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
