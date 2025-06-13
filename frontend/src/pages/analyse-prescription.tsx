import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Chip, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useGlobalState } from "../GlobalStateContext";
import { LoadingBars } from "../components/LoadingBars";
import PageHeader from "../components/PageHeader";
import useRequest from "../hooks/useRequest";
import { apiService } from "../services/api";

const AnalysePrescription = () => {
  const { prescriptionSummary, setPrescriptionSummary, selectedPrescription, setSelectedPrescription } = useGlobalState();
  const [pdfUrl, setPdfUrl] = useState<null | string>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, runRequest } = useRequest();

  useEffect(() => {
    if (selectedPrescription && prescriptionSummary) {
      const url = URL.createObjectURL(selectedPrescription);
      setPdfUrl(url);
    }
  }, [])

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedPrescription(event.target.files[0]);
    }
  };

  const handleClearSelection = () => {
    setSelectedPrescription(null);
    setPdfUrl(null);
    setPrescriptionSummary(null);
  };

  const handleUpload = async () => {
    if (selectedPrescription) {
      setPrescriptionSummary(null)
      const url = URL.createObjectURL(selectedPrescription);
      setPdfUrl(url);

      try {
        const summary = await runRequest(async ({ signal }) => {
          return await apiService.v1AnalysePrescription(selectedPrescription, signal);
        });
        setPrescriptionSummary(summary);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log(`Request cancelled: ${error.message}`)
        } else {
          window.alert('Error occurred while processing file, please try again.')
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto pr-5">
      <PageHeader title="Analyse Prescription"></PageHeader>
      <div className="flex flex-row gap-16 w-full h-20">
        <div className="flex flex-row gap-4 w-4/6">
          {!selectedPrescription && (
            <button
              className={`rounded-md w-full py-2 border border-cymbal-blue-300 text-cymbal-blue-300 hover:bg-cymbal-blue-100`}
              onClick={handleSelectFile}
            >
              {"Select prescription"}
            </button>
          )}
          {selectedPrescription && (
            <button
              className={`rounded-md w-full py-2 text-white bg-cymbal-blue-300 ${
                isLoading ? "opacity-50" : ""
              }`}
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : prescriptionSummary
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
          {selectedPrescription && (
            <Chip
              label={selectedPrescription.name}
              onDelete={handleClearSelection}
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
          <Button
            variant="contained"
            component="a"
            href="/Prescription_Matching.pdf"
            download
            sx={{
              backgroundColor: "red", // You can customize the color as needed
              "&:hover": {
                backgroundColor: "red", // Ensure hover color remains the same
              },
            }}
          >
            Matching Prescription
          </Button>
          <Button
            variant="contained"
            component="a"
            href="/Prescription_NotMatching.pdf"
            download
            sx={{
              backgroundColor: "red", // You can customize the color as needed
              "&:hover": {
                backgroundColor: "red", // Ensure hover color remains the same
              },
            }}
          >
            Not-Matching Prescription
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-16 w-full pb-10">
        <div className="flex flex-col gap-4 w-4/6">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "748px" }}
              title="PDF Viewer"
            ></iframe>
          )}
        </div>
        <div
          className={`flex flex-col gap-4 w-2/6 h-full transition duration-500 ${
            prescriptionSummary == null && !isLoading
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
            {prescriptionSummary ? (
              <div className="flex flex-row gap-4">
                <div className="h-[640px] overflow-y-auto w-full">
                  <div className="flex flex-col gap-2 h-fit">
                    <Markdown>{prescriptionSummary}</Markdown>
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

export default AnalysePrescription;
