import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Chip, Button } from "@mui/material"; // Import Button here
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGlobalState } from "../GlobalStateContext";
import { LoadingBars } from "../components/LoadingBars";
import PageHeader from "../components/PageHeader";
import useRequest from "../hooks/useRequest";
import { apiService } from "../services/api";
import { fixMarkdownNewlines } from "../utils";

const AnalyseMedicalReport = () => {
  const {
    selectedMedicalReport,
    setSelectedMedicalReport,
    medicalReportSummary,
    setMedicalReportSummary,
  } = useGlobalState();
  const [pdfUrl, setPdfUrl] = useState<null | string>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, runRequest, cancelRequest } = useRequest();

  useEffect(() => {
    if (selectedMedicalReport && medicalReportSummary) {
      const url = URL.createObjectURL(selectedMedicalReport);
      setPdfUrl(url);
    }
  }, []);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedMedicalReport(event.target.files[0]);
    }
  };

  const handleClearSelection = () => {
    setSelectedMedicalReport(null);
    setPdfUrl(null);
    setMedicalReportSummary(null);
    cancelRequest()
  };

  const handleUpload = async () => {
    if (selectedMedicalReport) {
      setMedicalReportSummary(null);
      const url = URL.createObjectURL(selectedMedicalReport);
      setPdfUrl(url);

      try {
        const summary: string = await runRequest(async ({ signal }) => {
          return await apiService.v2AnalyseMedicalReport(selectedMedicalReport, signal);
        });
        setMedicalReportSummary(fixMarkdownNewlines(summary));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log(`Request aborted: ${error.message}`)
        } else {
          window.alert("An error occurred: Please try again.");
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto pr-5">
      <PageHeader title="Analyse Medical Report"></PageHeader>
      <div className="flex flex-row gap-16 w-full h-20">
        <div className="flex flex-row gap-4 w-4/6">
          {!selectedMedicalReport && (
            <button
              className={`rounded-md w-full py-2 border border-cymbal-blue-300 text-cymbal-blue-300 hover:bg-cymbal-blue-100`}
              onClick={handleSelectFile}
            >
              {"Select medical report"}
            </button>
          )}
          {selectedMedicalReport && (
            <button
              className={`rounded-md w-full py-2 text-white bg-cymbal-blue-300 ${
                isLoading ? "opacity-50" : ""
              }`}
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : medicalReportSummary
                ? "Re-process PDF"
                : "Upload and Process PDF"}
            </button>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          ></input>
          {selectedMedicalReport && (
            <Chip
              label={selectedMedicalReport.name}
              onDelete={handleClearSelection}
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
          <Button
            variant="contained"
            component="a"
            href="/Medical_Report.pdf"
            download
            sx={{
              backgroundColor: "red", // You can customize the color as needed
              "&:hover": {
                backgroundColor: "red", // Ensure hover color remains the same
              },
            }}
          >
            Sample Report
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full pb-10">
        <div className="flex flex-col gap-4 w-3/6">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "748px" }}
              title="PDF Viewer"
              name="PDF viewer"
            ></iframe>
          )}
        </div>
        <div
          className={`flex flex-col gap-4 w-3/6 h-full transition duration-500 ${
            medicalReportSummary == null && !isLoading
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="bg-rose-200 rounded-lg generated-content-container relative">
            <div className="flex justify-center text-center pb-4 gap-2">
              <AutoAwesomeIcon
                className="text-xs"
                fontSize="small"
              ></AutoAwesomeIcon>
              <p className="text-xl font-bold">AI Summary</p>
            </div>
            {medicalReportSummary ? (
              <div className="flex flex-row gap-4">
                <div className="h-[640px] overflow-y-auto w-full">
                  <div className="flex flex-col gap-2 h-fit p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{medicalReportSummary}</ReactMarkdown>
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

export default AnalyseMedicalReport;
