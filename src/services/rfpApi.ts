import { BaseCrudService } from "./baseCrudService";
import { RfpFormState } from "../components/pages/RFPSubmitPage";
import { BuyerRFPs, miniRFP } from "../entities"


const INITIAL_URL = "api/rfp"


export function submitRFP(payload: RfpFormState) {
    return BaseCrudService.create<RfpFormState>(INITIAL_URL, payload)
}

export function getAllRFPsBelongToBuyer() {
    return BaseCrudService.getAll<{ success: boolean, data: BuyerRFPs[] }>(INITIAL_URL)
}

export function getAllRFPsMiniBelongToBuyer() {
    return BaseCrudService.getAll<{ success: boolean, data: miniRFP[] }>(INITIAL_URL+"/mini")
}

export function getRFPById(rfpId: string) {
    return BaseCrudService.getById<{ success: boolean, data: BuyerRFPs }>(INITIAL_URL, rfpId)
}

export function reSubmitRfp(rfpId: string) {
    return BaseCrudService.create<Object>(`${INITIAL_URL}/${rfpId}`, {})
}

export function sendVendorMailForProposal(userId:string,rfpId:string){
    return BaseCrudService.create<Object>(`${INITIAL_URL}/send-vendor-mail/${userId}/${rfpId}`, {})
}