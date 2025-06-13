import React, { createContext, useContext, useState } from "react";

type GlobalStateContextType = {
  selectedMedicalReport: File | null;
  setSelectedMedicalReport: React.Dispatch<React.SetStateAction<File | null>>;
  medicalReportSummary: string | null;
  setMedicalReportSummary: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPrescription: File | null;
  setSelectedPrescription: React.Dispatch<React.SetStateAction<File | null>>;
  prescriptionSummary: string | null;
  setPrescriptionSummary: React.Dispatch<React.SetStateAction<string | null>>;
  resetGlobalState: () => void;
};

const initialState = {
  selectedMedicalReport: null,
  setSelectedMedicalReport: () => {},
  medicalReportSummary: null,
  setMedicalReportSummary: () => {},
  selectedPrescription: null,
  setSelectedPrescription: () => {},
  prescriptionSummary: null,
  setPrescriptionSummary: () => {},
  resetGlobalState: () => {}
};

const GlobalStateContext = createContext<GlobalStateContextType>(initialState);

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedMedicalReport, setSelectedMedicalReport] =
    useState<File | null>(null);
  const [medicalReportSummary, setMedicalReportSummary] = useState<
    string | null
  >(null);
  const [selectedPrescription, setSelectedPrescription] = useState<File | null>(
    null
  );
  const [prescriptionSummary, setPrescriptionSummary] = useState<string | null>(
    null
  );

  const resetGlobalState = () => {
    setMedicalReportSummary(null)
    setSelectedMedicalReport(null)
    setPrescriptionSummary(null)
    setSelectedPrescription(null)
  }

  return (
    <GlobalStateContext.Provider
      value={{
        selectedMedicalReport,
        setSelectedMedicalReport,
        medicalReportSummary,
        setMedicalReportSummary,
        selectedPrescription,
        setSelectedPrescription,
        prescriptionSummary,
        setPrescriptionSummary,
        resetGlobalState
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
