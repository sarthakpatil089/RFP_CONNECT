import { motion } from "framer-motion";
import { useState } from "react";
import { createVendor, VendorPayload } from "../../services/vendorApi";
import { useToast } from "../../context/toastContext";

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    vendorName: "",
    emailAddress: "",
    company: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate form data
      if (
        !formData.vendorName ||
        !formData.emailAddress ||
        !formData.company ||
        !formData.password
      ) {
        addToast("Please fill in all fields", "success");
        setErrorMessage("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Create vendor record
      const vendorData: VendorPayload = {
        vendorCompanyName: formData.vendorName,
        emailAddress: formData.emailAddress,
        mainProductService: formData.company,
        password: formData.password,
      };

      const resp = await createVendor(vendorData);

      setSuccessMessage(resp?.message);
      setFormData({
        vendorName: "",
        emailAddress: "",
        company: "",
        password: "",
      });
      setTimeout(() => {
        window.location.href = "/vendors";
      }, 2000);
    } catch (error) {
      addToast("Failed to register vendor. Please try again.", "success");
      setErrorMessage("Failed to register vendor. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Vendor Registration
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Register your vendor account to connect with buyers and receive
              RFP notifications. Complete the form below with your business
              details and product information.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor Name */}
              <div>
                <label
                  htmlFor="vendorName"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Vendor Company Name
                </label>
                <input
                  type="text"
                  id="vendorName"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  placeholder="Enter your vendor name"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="emailAddress"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Company / Main Product/Service
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name or main product/service"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a secure password"
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="font-paragraph text-sm text-destructive">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="font-paragraph text-sm text-green-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base py-3 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">Registering...</div>
                ) : (
                  "Register Vendor"
                )}
              </button>
            </form>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-secondary text-secondary-foreground p-8"
          >
            <h2 className="font-heading text-2xl font-semibold mb-4">
              What Happens Next?
            </h2>
            <ul className="font-paragraph text-sm space-y-3 text-secondary-foreground/80">
              <li>{"→ Your account will be validated by our system"}</li>
              <li>{"→ You can add detailed product specifications"}</li>
              <li>{"→ Receive notifications when matched with buyer RFPs"}</li>
              <li>{"→ Access your vendor dashboard to manage listings"}</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
