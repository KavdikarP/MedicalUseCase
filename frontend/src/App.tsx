import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import SideBar from "./components/SideBar";
import { GlobalContext } from "./context";
import useTookitGateway from "./hooks/useToolkitGateway";
import AnalyseMedicalReport from "./pages/analyse-medical-report";
import AnalysePrescription from "./pages/analyse-prescription";
import ClaimApproval from "./pages/claim-approval";
import Documentation from "./pages/documentation";
import MedicalGlossary from "./pages/medical-glossary";

const muiTheme = createTheme({
  palette: {
    error: {
      main: "#ED1B2E",
    },
  },
  typography: {
    fontFamily: "Oxygen, sans-serif",
    button: {
      textTransform: "none",
      fontSize: "inherit",
      fontWeight: "normal",
      fontFamily: "inherit",
    },
  },
});

function App() {
//  const { user, signOut } = useTookitGateway();

//  return user == null ? (
//    <LoadingSplash></LoadingSplash>
//  ) : (
//    <GlobalContext.Provider
//      value={{
//        user: user,
//        signOut,
//      }}
//    >
return (
      <ThemeProvider theme={muiTheme}>
        <div className="p-8 flex flex-row gap-8 w-full h-full">
          <BrowserRouter>
            <SideBar></SideBar>
            <Switch>
              <Route path="/analyse-medical-report">
                <AnalyseMedicalReport></AnalyseMedicalReport>
              </Route>
              <Route path="/analyse-prescription">
                <AnalysePrescription></AnalysePrescription>
              </Route>
              <Route path="/claim-approval">
                <ClaimApproval></ClaimApproval>
              </Route>
              <Route path="/documentation">
                <Documentation></Documentation>
              </Route>
              <Route path="/glossary">
                <MedicalGlossary></MedicalGlossary>
              </Route>
              <Redirect to="/analyse-medical-report"></Redirect>
            </Switch>
          </BrowserRouter>
        </div>
      </ThemeProvider>
  //  </GlobalContext.Provider>
  );
}

export default App;
