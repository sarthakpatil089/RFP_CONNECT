import { motion } from "framer-motion";
import { useState } from "react";
import { createBuyer, BuyerPayload } from "../../services/buyerApi";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useToast } from "../../context/toastContext";

export default function BuyerRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { addToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    // basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.emailAddress ||
      !formData.phoneNumber ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.country ||
      !formData.password
    ) {
      setErrorMessage("Please fill in all required fields.");
      addToast("Please fill in all required fields.", "warn");
      setIsLoading(false);
      return;
    }

    try {
      const payload: BuyerPayload = { ...formData };
      const resp = await createBuyer(payload);
      setSuccessMessage(resp?.message || "Buyer registered successfully.");

      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        password: "",
      });

      // redirect later if needed
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setErrorMessage("Failed to register buyer. Please try again.");
      addToast("Failed to register buyer. Please try again.", "error");
      console.error("Buyer registration error:", err);
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
              Buyer Registration
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Create your buyer account to submit RFPs and receive vendor
              matches. Your contact information will be validated to ensure
              secure communication.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    First name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    Last name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="emailAddress"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    Email address *
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

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Address lines */}
              <div>
                <label
                  htmlFor="addressLine"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Address line
                </label>
                <input
                  type="text"
                  id="addressLine"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Building, area, etc."
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* City / State / Postal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    State / Province *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state/province"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                  >
                    Postal code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Select country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="font-paragraph text-sm font-medium text-textprimary block mb-2"
                >
                  Password *
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

              {/* Error */}
              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="font-paragraph text-sm text-destructive">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Success */}
              {successMessage && (
                <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="font-paragraph text-sm text-green-700">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base py-3 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
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
              Registration Benefits
            </h2>
            <ul className="font-paragraph text-sm space-y-3 text-secondary-foreground/80">
              <li>{"→ Submit requirements in natural language"}</li>
              <li>{"→ AI-powered vendor matching based on your needs"}</li>
              <li>{"→ Receive shortlisted vendor recommendations"}</li>
              <li>{"→ Streamlined procurement workflow"}</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
