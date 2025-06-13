export interface GenericAPIResponse {
    data: {
        summary: string
    },
    status: number
}

export interface ClaimApprovalPayload {
    prescription: string,
    medical_report: string,
    model?: ModelType
}

export interface ClaimApprovalResponse {
    summary: string,
    outcome: string
}

export enum ClaimApprovalOutcome {
    SUCCESSFUL = "Go Ahead for Claim Approval",
    UNSUCCESSFUL = "Cannot Approve Claim with the given information"
}

export interface MedicalGlossaryPayload {
    query: string,
    model: ModelType
}

export interface MedicalGlossaryResponse {
    result: string
}

export type ModelType = "gemini-1.5-pro" | "medlm";
