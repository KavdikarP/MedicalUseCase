import axios from "axios";
import {
  ClaimApprovalPayload,
  ClaimApprovalResponse,
  GenericAPIResponse,
  MedicalGlossaryPayload,
  MedicalGlossaryResponse,
} from "../types";

class ApiService {
  private baseUrl: string;

  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.baseUrl = "http://localhost:8081";
      // this.baseUrl = "https://prudential-uw-backend-837692659788.us-central1.run.app"
    } else {
      this.baseUrl = "https://prudential-uw-backend-837692659788.us-central1.run.app";
    }
  }

  async v1AnalyseMedicalReport(pdf_file: File) {
    const url = `${this.baseUrl}/v1/analyse-medical-report`;
    const payload = new FormData();
    payload.append("pdf_file", pdf_file);
    const response: GenericAPIResponse = await axios.post(url, payload);
    return response.data.summary;
  }

  async v2AnalyseMedicalReport(pdf_file: File, signal: AbortSignal) {
    const url = `${this.baseUrl}/v2/analyse-medical-report`;
    const payload = new FormData();
    payload.append("pdf_file", pdf_file);
    const config = {
      signal: signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response: GenericAPIResponse = await axios.post(
        url,
        payload,
        config
      );
      return response.data.summary;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        throw error;
      }
    }
  }

  async v1AnalysePrescription(pdf_file: File, signal: AbortSignal) {
    const url = `${this.baseUrl}/v1/analyse-prescription`;
    const payload = new FormData();
    payload.append("pdf_file", pdf_file);

    const config = {
      signal: signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response: GenericAPIResponse = await axios.post(
        url,
        payload,
        config
      );
      return response.data.summary;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        throw error;
      }
    }
  }

  async v1ClaimApproval(payload: ClaimApprovalPayload) {
    const url = `${this.baseUrl}/v1/claim-approval`;
    const response: GenericAPIResponse = await axios.post(url, payload);
    return response.data as ClaimApprovalResponse;
  }

  async v1MedicalGlossary(payload: MedicalGlossaryPayload) {
    const url = `${this.baseUrl}/v1/medical-glossary`;
    const response = await axios.post(url, payload);
    return response.data as MedicalGlossaryResponse;
  }
}

export const apiService = new ApiService();
