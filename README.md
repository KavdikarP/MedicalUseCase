# Insurance Underwriting & Claim Approval

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

This solution automates analysis of medical reports, prescriptions and insurance claim approvals.

**Key Features**

*   **Medical Report Analysis:** Utilizes MedLM to analyze medical reports and prescriptions.
*   **Fraud Detection:** Compares medical reports and prescriptions to detect inconsistencies and recommend claim approval outcome.
*   **Underwriting Support:** Analyzes medical reports and blood tests to detect anomalies and pre-existing conditions.

## Solution Design

For detailed design insights, refer to:

[go/insurance-underwriting-fraud-detection-sdd](https://docs.google.com/document/d/1iF7ruWWxgZCDFe3rEu9ra3fHfUOnW7LT-VLtj_GnI24/edit?usp=sharing&resourcekey=0-Nla36fX2klJzPpEDjeZtyA)

## Live Demo

Live demo can be found at:

[go/apac-ai-prototyping-demos](http://go/apac-ai-prototyping-demos)

## Getting Started

### Prerequisites

*   **Node.js:** For the frontend.
*   **Python:** For the backend.

### Running Locally

#### Frontend

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the server: `npm start`

#### Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Create a virtual environment: `python -m venv .`
3.  Activate the environment: `source bin/activate` 
4.  Install dependencies: `pip install -r requirements.txt`
5.  Run the server: `sh scripts/dev.sh`

### Deploying

*   **Frontend:** `sh scripts/deploy.sh`
*   **Backend:** `sh scripts/deploy.sh`

## How to Use

1.  Visit the demo URL.
2.  Download demo documents from [go/insurance-underwriting-fraud-detection-demo-docs](https://drive.google.com/drive/folders/1KB8WR5c8PdSy0k-0xRZsedBC3ohX_aw1?usp=drive_link)
3.  Upload the medical report and prescription.
3.  Click on the "Analyze" button.
4.  View the results of the analysis on right side of page.
5.  Go to claim approval page and hit "Suggest Claim Outcome"
6.  View the results on right side of page.
