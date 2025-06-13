import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { LoadingBars } from "../components/LoadingBars";
import PageHeader from "../components/PageHeader";
import useRequest from "../hooks/useRequest";
import { apiService } from "../services/api";
import { ModelType } from "../types";

const MedicalGlossary = () => {
  const [query, setQuery] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<ModelType>("medlm");
  const [response, setResponse] = useState<string | null>(null);
  const { isLoading, runRequest } = useRequest();

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value as ModelType);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setResponse(null);
    try {
      const result = await runRequest(async () => {
        return await apiService.v1MedicalGlossary({
          query,
          model: selectedModel,
        });
      });
      setResponse(result.result);
    } catch (error) {
      window.alert(
        "Error occurred while processing your query, please try again."
      );
      console.error("Error processing query:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 overflow-y-auto pr-5">
      <PageHeader title="Medical Glossary"></PageHeader>
      <div className="flex flex-row gap-16 w-full h-full">
        <div className="flex flex-col gap-4 w-2/6">
          <h2 className="text-xl font-bold">Model Selection</h2>
          <FormControl fullWidth>
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              className="bg-white"
            >
              <MenuItem value="gemini-1.5-pro">Gemini 1.5 Pro</MenuItem>
              <MenuItem value="medlm">MedLM</MenuItem>
            </Select>
          </FormControl>

          <h2 className="text-xl font-bold mt-4">Your Query</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your medical query here..."
          />

          <button
            className={`rounded-md w-full py-2 text-white mt-4 ${
              query.trim() ? "bg-cymbal-blue-300" : "bg-slate-400"
            } ${isLoading ? "opacity-50" : ""}`}
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
          >
            {isLoading ? "Processing..." : "Submit Query"}
          </button>
        </div>

        <div
          className={`flex flex-col gap-4 w-4/6 h-full transition duration-500 ${
            response == null && !isLoading
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
              <p className="text-xl font-bold">AI Response</p>
            </div>
            {response ? (
              <div className="flex flex-row gap-4">
                <div className="h-[640px] overflow-y-auto w-full p-6">
                  <ReactMarkdown children={response.replace(/\n/g, "\n\n&nbsp;")}></ReactMarkdown>
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

export default MedicalGlossary;