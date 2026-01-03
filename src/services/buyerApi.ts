import { BaseCrudService } from "./baseCrudService";


export interface BuyerPayload {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    addressLine?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    password: string;
}

export interface BuyerResponse {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    addressLine?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isEmailVerified: boolean;
    status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
}

const INITIAL_URL = "api/buyer"

// Create buyer
export function createBuyer(payload: BuyerPayload) {
    return BaseCrudService.create<BuyerPayload>(`${INITIAL_URL}/register`, payload);
}

// Get all buyers
export function getBuyers() {
    return BaseCrudService.getAll<{ data: BuyerResponse[], success: boolean }>(INITIAL_URL+"/all");
}

// Get buyer by id
export function getBuyer(id: string) {
    return BaseCrudService.getById<{ data: BuyerResponse, success: boolean }>(INITIAL_URL, id);
}
