import { BaseCrudService } from "./baseCrudService";



export interface LoginPayload {
    role: "VENDOR" | "BUYER";
    email: string;
    password: string;
}

export interface LoginResponse {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    token: string;
}

export function loginUser(payload:LoginPayload){
    return BaseCrudService.create<LoginPayload>("api/auth/login", payload);
}