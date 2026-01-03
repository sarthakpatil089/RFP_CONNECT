
import { BaseCrudService } from "./baseCrudService";
import { VendorProducts } from "../entities/index";

const INITIAL_URL = "api/vendor";

export interface ProductPayload {
    products: VendorProducts[];
}

export function createProduct(payload: ProductPayload, vendorId: string) {
    return BaseCrudService.create<ProductPayload>(`${INITIAL_URL}/${vendorId}/product`, payload);
}

export function getAllProducts(vendorId: string) {
    return BaseCrudService.getAll<{ data: VendorProducts[], success: boolean }>(`${INITIAL_URL}/${vendorId}/product`);
}