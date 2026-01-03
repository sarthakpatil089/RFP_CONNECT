import { Vendors } from "../entities";
import { BaseCrudService } from "./baseCrudService";

export interface VendorPayload {
  vendorCompanyName: string;
  emailAddress: string;
  mainProductService?: string;
  password: string;
}

export interface VendorStep1Payload {
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  establishedDate: string;
  deliveryTimeFrame: string;
  onboardingProgress: number;
  onboardingCompleted: boolean;
  vendorCompanyName?: string;
  mainProductService?: string;
}
const INITIAL_URL = "api/vendor";
// Create vendor
export function createVendor(payload: VendorPayload) {
  return BaseCrudService.create<VendorPayload>(`${INITIAL_URL}/register`, payload);
}

// Get all vendors
export function getVendors() {
  return BaseCrudService.getAll<{ data: Vendors[], success: boolean }>(INITIAL_URL);
}

// Get vendor by id
export function getVendor(id: string, proposalAccepted?: string) {
  const proposal = proposalAccepted ? proposalAccepted : false;
  return BaseCrudService.getById<{ data: Vendors, success: boolean }>(`${INITIAL_URL}/${proposal}`, id);
}

export function updateVendor(id: string, payload: Partial<VendorStep1Payload>) {
  return BaseCrudService.update<VendorStep1Payload>(`${INITIAL_URL}/onboard/step1`, id, payload);
}
