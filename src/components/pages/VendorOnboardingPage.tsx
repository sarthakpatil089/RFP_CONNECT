import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store/store";
import LoadingSpinner  from "../ui/LoadingSpinner";
import { updateVendor } from "../../services/vendorApi";
import { createProduct } from "../../services/productApi";
import { Vendors, sampleBuyer, VendorProducts } from "../../entities/index";
import { getVendor } from "../../services/vendorApi";
import { addUser } from "../../store/userSlice";
import { useToast } from "../../context/toastContext";

export default function VendorOnboardingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step1Completed, setStep1Completed] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {addToast}= useToast();

  // Get current step from URL params, default to 1
  const currentStep = parseInt(searchParams.get("step") || "1");

  // Step 1: Basic Info
  const [step1Data, setStep1Data] = useState({
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    establishedDate: "",
    deliveryTimeframe: "",
  });

  // Step 2: Products - UPDATED with price and deliveryTime
  const [step2Data, setStep2Data] = useState<{
    companyName: string;
    mainProductService: string;
    products: VendorProducts[];
  }>({
    companyName: "",
    mainProductService: "",
    products: [
      {
        productName: "",
        description: "",
        category: "",
        price: 0,
        deliveryTime: "",
      },
    ],
  });

  useEffect(() => {
    const handleUserData = async () => {
      if (user.id === sampleBuyer.id) {
        try {
          setIsLoading(true);
          const resp = await getVendor(localStorage.getItem("id") || "");
          dispatch(addUser({ ...resp.data, role: "VENDOR" }));
        } catch (error:any) {
          addToast(error.message||"Failed to fetch vendor","error")
          console.error("Failed to fetch vendor:", error);
        } finally {
          setIsLoading(false);
        }
      }
      setStep1Data({
        phoneNumber: (user as Vendors).phoneNumber || "",
        address: user.address || "",
        city: "city" in user ? (user as Vendors).city || "" : "",
        state: "state" in user ? (user as Vendors).state || "" : "",
        pincode: "pincode" in user ? (user as Vendors).pincode || "" : "",
        establishedDate:
          "establishedDate" in user
            ? ((user as Vendors).establishedDate || "").toString()
            : "",
        deliveryTimeframe:
          "deliveryTimeframe" in user
            ? (user as Vendors).deliveryTimeframe || ""
            : "",
      });

      setStep2Data({
        companyName:
          "vendorCompanyName" in user
            ? (user as Vendors).vendorCompanyName || ""
            : "",
        mainProductService:
          "mainProductService" in user
            ? (user as Vendors).mainProductService || ""
            : "",
        products: [
          {
            productName: "",
            description: "",
            category: "",
            price: 0,
            deliveryTime: "",
          },
        ],
      });
    };

    handleUserData();
  }, [user, dispatch,addToast]);

  // Sync step changes with URL
  useEffect(() => {
    if (currentStep < 1 || currentStep > 2) {
      setSearchParams({ step: "1" });
    }
    const step = localStorage.getItem("onboardingStep");
    setSearchParams({ step: step ? (parseInt(step) + 1).toString() : "1" });
  }, [currentStep, setSearchParams]);

  const handleStep1Change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStep1Data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStep2Change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setStep2Data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = () => {
    setStep2Data((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productName: "",
          description: "",
          category: "",
          price: 0,
          deliveryTime: "",
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setStep2Data((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    setStep2Data((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  // Update URL when step changes
  const goToStep = (step: number) => {
    setSearchParams({ step: step.toString() });
    localStorage.setItem("onboardingStep", step.toString())
  };

  const validateStep1 = () => {
    return (
      step1Data.phoneNumber &&
      step1Data.address &&
      step1Data.city &&
      step1Data.state &&
      step1Data.pincode &&
      step1Data.establishedDate &&
      step1Data.deliveryTimeframe
    );
  };

  const validateStep2 = () => {
    return (
      step2Data.companyName &&
      step2Data.mainProductService &&
      step2Data.products.some((p) => p.productName && p.description && p.price)
    );
  };

  const handleNext = () => {
    if (!validateStep1()) {
      addToast("Please fill all required fields in Step 1.","error")
      setErrorMessage("Please fill all required fields in Step 1.");
      return;
    }
    setErrorMessage("");
    goToStep(2);
  };

  const handleStep1Submit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const id = localStorage.getItem("id");
      await updateVendor(id || "", {
        ...step1Data,
        mainProductService: (user as Vendors).mainProductService || "",
        vendorCompanyName: (user as Vendors).vendorCompanyName || "",
        onboardingProgress: 1,
      });
      setStep1Completed(true);
      setSuccessMessage("Step 1 completed! Please complete Step 2.");
    } catch (err) {
      setErrorMessage("Failed to save Step 1 data. Please try again.");
      console.error("Step 1 error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      addToast("Please fill all required fields including product price.","error")
      setErrorMessage(
        "Please fill all required fields including product price."
      );
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const id = localStorage.getItem("id");
      console.log(step1Data);
      await updateVendor(id || "", {
        ...step1Data,
        city: user.address || "",
        mainProductService: step2Data.mainProductService || "",
        vendorCompanyName: step2Data.companyName || "",
        onboardingProgress: 2,
        onboardingCompleted: true,
      });
      const payload = {
        products: step2Data.products,
      };
      await createProduct(payload, id || "");
      setSuccessMessage("Vendor onboarding completed successfully!");
      addToast("Vendor onboarding completed successfully!","success")
      setTimeout(() => {
        navigate("/buyers", {replace:true})
      }, 2000);
    } catch (err) {
      addToast("Failed to complete onboarding. Please try again.","error")
      setErrorMessage("Failed to complete onboarding. Please try again.");
      console.error("Step 2 error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    return currentStep === 1 ? "50%" : "100%";
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Vendor Onboarding
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Complete your vendor profile in two simple steps to start
              receiving RFP matches from qualified buyers.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
              <span className="font-paragraph text-sm text-textprimary/70">
                Step {currentStep} of 2
              </span>
              <span className="font-paragraph text-sm text-textprimary/70">
                {getProgress()}
              </span>
            </div>
            <div className="w-full bg-textprimary/10 rounded-full h-2">
              <motion.div
                key={currentStep}
                initial={{ width: "0%" }}
                animate={{ width: getProgress() }}
                transition={{ duration: 0.5 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
            >
              <h2 className="font-heading text-3xl font-bold mb-8">
                Step 1: Business Details
              </h2>

              <div className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={step1Data.phoneNumber}
                    onChange={handleStep1Change}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={step1Data.address}
                    onChange={handleStep1Change}
                    placeholder="Building, street, area"
                    className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                {/* City/State/Pin */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={step1Data.city}
                      onChange={handleStep1Change}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={step1Data.state}
                      onChange={handleStep1Change}
                      placeholder="Enter state"
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={step1Data.pincode}
                      onChange={handleStep1Change}
                      placeholder="123456"
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Established Date & Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      Established Date *
                    </label>
                    <input
                      type="date"
                      name="establishedDate"
                      value={step1Data.establishedDate}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      Typical Delivery Timeframe *
                    </label>
                    <select
                      name="deliveryTimeframe"
                      value={step1Data.deliveryTimeframe}
                      onChange={handleStep1Change}
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Select timeframe</option>
                      <option value="1-3 days">1-3 days</option>
                      <option value="4-7 days">4-7 days</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1+ month">1+ month</option>
                    </select>
                  </div>
                </div>

                {/* Messages */}
                {errorMessage && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="font-paragraph text-sm text-destructive">
                      {errorMessage}
                    </p>
                  </div>
                )}
                {successMessage && (
                  <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="font-paragraph text-sm text-green-700">
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleStep1Submit}
                    disabled={isLoading}
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading text-base py-3 rounded-lg transition-colors"
                  >
                    {isLoading ? "Saving..." : "Save & Continue Later"}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading || !step1Completed}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base py-3 rounded-lg transition-colors"
                  >
                    Next: Step 2 →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Products - UPDATED WITH PRICE & DELIVERY TIME */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-background border-2 border-textprimary/10 p-8 lg:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-3xl font-bold">
                  Step 2: Products & Services
                </h2>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* Company Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={step2Data.companyName}
                      onChange={handleStep2Change}
                      placeholder="Your company name"
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                      Main Product/Service *
                    </label>
                    <input
                      type="text"
                      name="mainProductService"
                      value={step2Data.mainProductService}
                      onChange={handleStep2Change}
                      placeholder="Primary offering (e.g., Software Development)"
                      className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Products List - UPDATED LAYOUT */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-paragraph text-sm font-medium text-textprimary">
                      Products/Services Details *
                    </label>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    >
                      + Add Product
                    </button>
                  </div>

                  {step2Data.products.map((product, index) => (
                    <div
                      key={index}
                      className="border border-textprimary/20 rounded-lg p-6 mb-4 bg-background/50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-heading text-lg font-semibold">
                          Product {index + 1}
                        </h4>
                        {step2Data.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-destructive hover:text-destructive/80 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Product Fields - 2 ROWS LAYOUT */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            value={product.productName}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "productName",
                                e.target.value
                              )
                            }
                            placeholder="Product name"
                            className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                            Category
                          </label>
                          <select
                            value={product.category}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Select category</option>
                            <option value="Software">Software</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Services">Services</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Manufacturing">Manufacturing</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                            Price * (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={product.price}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="999.99"
                            className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                            Delivery Time
                          </label>
                          <select
                            value={product.deliveryTime}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "deliveryTime",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Select delivery time</option>
                            <option value="1-3 days">1-3 days</option>
                            <option value="4-7 days">4-7 days</option>
                            <option value="1-2 weeks">1-2 weeks</option>
                            <option value="2-4 weeks">2-4 weeks</option>
                            <option value="1+ month">1+ month</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-paragraph text-sm font-medium text-textprimary block mb-2">
                          Description *
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe your product/service..."
                          rows={3}
                          className="w-full px-4 py-3 border border-textprimary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-vertical"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Messages */}
                {errorMessage && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="font-paragraph text-sm text-destructive">
                      {errorMessage}
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
                    <div className="flex items-center gap-2 justify-center">
                      <LoadingSpinner />
                      Completing Onboarding...
                    </div>
                  ) : (
                    "Complete Onboarding"
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-secondary text-secondary-foreground p-8"
          >
            <h2 className="font-heading text-2xl font-semibold mb-4">
              Why Complete Onboarding?
            </h2>
            <ul className="font-paragraph text-sm space-y-3 text-secondary-foreground/80">
              <li>→ Get matched with relevant buyer RFPs automatically</li>
              <li>→ Showcase your products to qualified prospects</li>
              <li>→ Receive notifications for perfect-fit opportunities</li>
              <li>→ Build trust with complete business verification</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
