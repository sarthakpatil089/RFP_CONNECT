
export interface BuyerRFPs {
  id: string;
  buyerId: string;
  rfpTitle: string;
  buyerExpectations: string;
  expectedDelivery: string;
  budgetRange?: string;
  additionalContext?: string;
  aiParsedRequirements?: RfpParsedRequirements | null;
  shortlistedVendorsList?: shortlistedVendorsList[] | null;
  notificationSent: boolean;
  rfpStatus: RfpStatus;
  submissionDate: string;
  createdAt: Date;
  updatedAt: Date;
  Vendors?: SelectedVendors[]
}

export interface SelectedVendors {
  id: string;
  vendorCompanyName: string;
  mainProductService: string;
  RfpVendor: { notificationSent: boolean, score: number, proposalAccepted: boolean };
}
export interface RfpParsedRequirements {
  summary: string;
  businessDomain: string;
  primaryGoal: string;
  techStack: string[];
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  expectedDelivery: string;
}
export interface shortlistedVendorsList {
  id: string;
  vendorName: string;
}
export type RfpStatus = "Pending" | "Parsed" | "Shortlisted" | "Notified" | "Under Evaluation" | "Closed";

export interface Buyers {
  id: string;
  // Name
  firstName?: string;
  lastName?: string;

  // Contact 
  emailAddress?: string;
  phone?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  // Verification
  isEmailVerified?: boolean;
  emailVerifiedAt?: Date | string;

  // Status
  status?: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | string;
}


export interface VendorProducts {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  productName?: string;
  description?: string;
  productImage?: string;
  price?: number;
  category?: string;
  deliveryTime?: string;
  productURL?: string;
}


export interface Vendors {
  id: string;                          // UUID
  vendorCompanyName: string;
  emailAddress: string;
  mainProductService?: string | null;  // Optional
  passwordHash?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;       // Optional
  phoneNumber?: string | null;         // Step 1 field
  address?: string | null;             // Step 1 field (addressLine in API)
  pincode?: string | null;             // Step 1 field (postalCode in API)
  state?: string | null;               // Step 1 field
  city?: string | null;                // Step 1 field (missing in schema - add it!)
  establishedDate?: Date | null;       // Step 1 field
  deliveryTimeframe?: string | null;   // Step 1 field
  status?: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  onboardingCompleted?: boolean;
  onboardingProgress?: number;
  createdAt?: Date;                    // Sequelize auto
  updatedAt?: Date;                    // Sequelize auto
  vendorId?: string;                  // Custom vendor identifier
  token?: string;
  role?: string;
}

export const sampleBuyer: Buyers = {
  id: "9a7f3b52-82c1-4f95-b951-2d17a68c532f",

  firstName: "Rohit",
  lastName: "Sharma",

  emailAddress: "rohit.sharma@example.com",
  phone: "+91 9876543210",

  address: "221B Baker Street",
  city: "London",
  state: "London",
  country: "UK",
  postalCode: "NW1 6XE",

  isEmailVerified: true,
  emailVerifiedAt: "2025-01-15T10:35:00Z",

  status: "ACTIVE",
};

export interface miniRFP {
  id: string;
  rfpTitle: string;
  buyerExpectations: string;
  rfpStatus: string;
  notificationSent: boolean;
}