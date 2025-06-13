import PageHeader from "../components/PageHeader";

const Documentation = () => {
    return (
      <div className="flex flex-col w-full gap-10 pr-5">
        <PageHeader title="Demo Documentation"></PageHeader>
        <div className="flex flex-col gap-2">
          <span>
            Solution Design:{" "}
             This solution automates analysis of medical reports, prescriptions and insurance claim approvals.

             Key Features are as follows: 
             # Medical Report Analysis: Utilizes MedLM to analyze medical reports and prescriptions.
             # Fraud Detection: Compares medical reports and prescriptions to detect inconsistencies and recommend claim approval outcome.
             # Underwriting Support: Analyzes medical reports and blood tests to detect anomalies and pre-existing conditions. 
          </span>
        </div>
      </div>
    );
  };
  
  export default Documentation;
  
