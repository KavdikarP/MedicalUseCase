import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Chip, FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router-dom";
import { useGlobalState } from "../GlobalStateContext";
import { LoadingBars } from "../components/LoadingBars";
import PageHeader from "../components/PageHeader";
import useRequest from "../hooks/useRequest";
import { apiService } from "../services/api";
import { ClaimApprovalOutcome, ClaimApprovalResponse, ModelType } from "../types";

const ClaimApproval = () => {
  const { selectedPrescription, selectedMedicalReport, prescriptionSummary, medicalReportSummary, resetGlobalState } =
    useGlobalState();
  const [claimOutcome, setClaimOutcome] = useState<null | ClaimApprovalResponse>(null);
  const { isLoading, runRequest } = useRequest();
  const [selectedModel, setSelectedModel] = useState<ModelType>("medlm");
  let history = useHistory();

  const handleRunClaimAnalysis = async () => {
    if (prescriptionSummary && medicalReportSummary) {
      setClaimOutcome(null);
      try {
        const claimOutcome: ClaimApprovalResponse = await runRequest(async () => {
          return await apiService.v1ClaimApproval({
            prescription: prescriptionSummary,
            medical_report: medicalReportSummary,
            model: selectedModel,
          });
        });
        setClaimOutcome(claimOutcome);
      } catch (error) {
        window.alert("Error occurred while processing claim outcome, please try again.");
        console.error("Error processing claim outcome:", error);
      }
    }
  };

  const handleResetStateAndRedirect = () => {
    resetGlobalState();
    history.push("/analyse-medical-report");
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto pr-5">
      <PageHeader title="Claim Approval"></PageHeader>
      <div className="flex flex-row gap-16 w-full h-full">
        <div className="flex flex-col gap-4 w-2/6">
          <h2 className="text-xl font-bold">Model Selection</h2>
          <FormControl className="w-fit">
            <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as ModelType)} className="bg-white">
              <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
              <MenuItem value="medlm">MedLM</MenuItem>
            </Select>
          </FormControl>
          <h2 className="text-xl font-bold">Medical Report</h2>
          {selectedMedicalReport && (
            <Chip
              label={selectedMedicalReport.name}
              style={{
                width: `${
                  selectedMedicalReport.name.length < 15
                    ? selectedMedicalReport.name.length * 12
                    : selectedMedicalReport.name.length * 8
                }px`,
                backgroundColor: "#ABBDFF",
                color: "black",
              }}
            />
          )}
          <h2 className="text-xl font-bold">Prescription</h2>
          {selectedPrescription && (
            <Chip
              label={selectedPrescription.name}
              style={{
                width: `${
                  selectedPrescription.name.length < 15
                    ? selectedPrescription.name.length * 12
                    : selectedPrescription.name.length * 8
                }px`,
                backgroundColor: "#ABBDFF",
                color: "black",
              }}
            />
          )}
          <button
            className={`rounded-md w-full py-2 text-white mt-4 ${
              prescriptionSummary && medicalReportSummary ? "bg-cymbal-blue-300" : "bg-slate-400"
            } ${isLoading ? "opacity-50" : ""}`}
            onClick={handleRunClaimAnalysis}
            disabled={!(prescriptionSummary && medicalReportSummary) || isLoading}
          >
            {isLoading ? "Processing..." : claimOutcome ? "Re-run Analysis" : "Suggest Claim Outcome"}
          </button>
        </div>
        <div
          className={`flex flex-col gap-4 w-4/6 h-full transition duration-500 ${
            claimOutcome == null && !isLoading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="bg-rose-200 rounded-lg generated-content-container relative">
            <div className="flex justify-center text-center pb-4 gap-2">
              <AutoAwesomeIcon className="text-xs" fontSize="small"></AutoAwesomeIcon>
              <p className="text-xl font-bold">AI Summary</p>
            </div>
            {claimOutcome ? (
              <div className="flex flex-row gap-4">
                <div className="h-[640px] overflow-y-auto w-full">
                  <div className="flex flex-col gap-2 h-fit">
                    <ReactMarkdown children={claimOutcome.summary}></ReactMarkdown>
                    <div className="text-center mt-10">
                      <button
                        disabled={true}
                        className={`rounded-md w-auto p-3 text-white font-bold text-center ${
                          claimOutcome.outcome.trim() == ClaimApprovalOutcome.SUCCESSFUL ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {claimOutcome.outcome}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-4 text-center">
                <div className="flex flex-col h-[640px] w-full gap-2 pt-10">
                  <LoadingBars barCount={5} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimApproval;
