export function shortlistVendors(aiParsed, vendors, buyer, minScore = 8) {
  const requiredTech = aiParsed.techStack?.map((t) => t.toLowerCase()) || [];
  const mustHave = aiParsed.mustHaveFeatures?.map((f) => f.toLowerCase()) || [];
  const buyerLocation = extractBuyerLocation(buyer);

  return vendors
    .map((v) => {
      const score = calculateVendorScore(
        v,
        requiredTech,
        mustHave,
        buyerLocation,
        aiParsed.expectedDelivery
      );
      return { vendor: v, score };
    })
    .filter((item) => item.score > minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ vendor }) => formatVendorResult(vendor));
}

// Extract buyer location
function extractBuyerLocation(buyer) {
  return [
    buyer?.city?.toLowerCase(),
    buyer?.state?.toLowerCase(),
    buyer?.country?.toLowerCase(),
  ]
    .filter(Boolean)
    .join(" ");
}

// Build all searchable skills
function buildVendorSkills(vendor) {
  const productSkills =
    vendor.products
      ?.map((p) => `${p.name || ""} ${p.description || ""} ${p.category || ""}`)
      .join(" ") || "";

  return [
    vendor.mainProductService || "",
    vendor.vendorCompanyName || "",
    vendor.state || "",
    vendor.address || "",
    vendor.pincode || "",
    vendor.deliveryTimeframe || "",
    productSkills,
  ]
    .join(" ")
    .toLowerCase();
}

// Main scoring function
function calculateVendorScore(
  vendor,
  requiredTech,
  mustHave,
  buyerLocation,
  expectedDelivery
) {
  let score = 0;

  const skills = buildVendorSkills(vendor);
  const productSkills = extractProductSkills(vendor);

  score += calculateTechScore(requiredTech, skills, productSkills);
  score += calculateFeatureScore(mustHave, skills, productSkills);
  score += calculateLocationScore(vendor, buyerLocation);
  score += calculateDeliveryScore(vendor.deliveryTimeframe, expectedDelivery);
  score += calculateProductBonus(vendor.products);
  score += calculateOnboardingBonus(vendor.onboardingCompleted);

  return score;
}

// Tech stack scoring
function calculateTechScore(requiredTech, skills, productSkills) {
  let score = 0;
  requiredTech.forEach((tech) => {
    if (tech && skills.includes(tech)) {
      score += 3;
      if (productSkills.includes(tech)) score += 2; // Product bonus
    }
  });
  return score;
}

// Feature scoring
function calculateFeatureScore(mustHave, skills, productSkills) {
  let score = 0;
  mustHave.forEach((feature) => {
    if (feature && skills.includes(feature)) {
      score += 2;
      if (productSkills.includes(feature)) score += 1; // Product bonus
    }
  });
  return score;
}

// Location scoring
function calculateLocationScore(vendor, buyerLocation) {
  if (!buyerLocation) return 0;

  if (vendor.state && buyerLocation.includes(vendor.state.toLowerCase()))
    return 5;
  if (
    vendor.address &&
    buyerLocation.includes(vendor.city?.toLowerCase() || "")
  )
    return 3;

  const countries = ["india", "us", "usa"];
  if (
    countries.some(
      (c) => buyerLocation.includes(c) && buildVendorSkills(vendor).includes(c)
    )
  ) {
    return 2;
  }

  return 0;
}

// Delivery scoring
function calculateDeliveryScore(vendorDelivery, expectedDelivery) {
  return expectedDelivery &&
    vendorDelivery?.toLowerCase().includes(expectedDelivery.toLowerCase())
    ? 2
    : 0;
}

// Product bonuses
function calculateProductBonus(products) {
  return products?.length > 0 ? products.length * 0.5 : 0;
}

// Onboarding bonus
function calculateOnboardingBonus(onboardingCompleted) {
  return onboardingCompleted ? 3 : 0;
}

// Extract product skills only
function extractProductSkills(vendor) {
  return (
    vendor.products
      ?.map((p) => `${p.name || ""} ${p.description || ""} ${p.category || ""}`)
      .join(" ") || ""
  );
}

// Format final result
function formatVendorResult(vendor) {
  return {
    id: vendor.id,
    vendorName: vendor.vendorCompanyName || vendor.emailAddress,
    productCount: vendor.products?.length || 0,
    score: Math.round(10) / 10,
  };
}
