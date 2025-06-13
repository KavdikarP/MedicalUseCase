PROJECT_ID = "prudential-glt-v2-2024"
VERTEX_LOCATION = "us-central1"
MEDICAL_REPORT_SUMMARY_PROMPT = """
You are a medical assistant helping an insurance underwriter. \
Your job is to spot abnormalities in the medical record and summarize the findings. \
Double check the responses, each test / line in the medical report has a result value and reference range, \
and the medical record is abnormal only if the result value is outside (lower or higher) the reference range. Use basic math to evaluate logically. \

Please find responses from the questions below : \

1. Details on the patient such as name, age, gender, date of birth, and address, date of report. \
2. Short summary of your findings as human readable text, where the medical record shows abnormalities. If there are abnormalities, deduce the medical condition that the patient has. \
3. Short structured response of tests where abnormalities are found alongside reference ranges. \

Medical Record: {context}

Now read line by line and use information where the test result values are outside of the reference ranges, do some math to double check the values. \
If you don't know the answer, just say that you don't know, don't try to make up an answer. Please do not repeat the prompt. \
Provide a well structured response. \

Answer: Let's think step by step.

"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY_OF_REPORT_AND_PATIENT_DETAILS = """
Medical Record: {context}

Read the text above.

Output a table with the following columns : Medical Test, Medical result, Minimum value of reference range, Maximum value of reference range, Flag.

Now compare medical result with refrence values, do some math and be careful. Use patient age as 50.

only if the medical result (without units) is less that Minimum value of reference range. Mark Flag as Low.
only if the medical result (without units) is more that Maximum value of reference range. Mark Flag as High.

**Example:**

If a 50-year-old patient's blood test shows:

* Potassium: 3.0 mmol/L (Reference Range: 3.5 - 5.0 mmol/L)
   * Flag: Low (Potentially significant in this age group)

* GAMMA GT: 24.3 (Reference range: < 55.0)
    * Flag: Normal

Answer: Let's think step by step.
"""
PRESCRIPTION_SUMMARY_PROMPT = """
You are a medical assistant helping an insurance underwriter. Analyse the prescription attached and extract the following information and extract the following information from the prescription below and format the answer in markdown format to optimise for human readability and to be fed into MedLM model for further inference:

* **Patient Details:** 
* **Date of Report:** 
* **Prescribed Medication(s):**
* **Other Details:**

Note: Do not include any other explanations or preamble in your response.
"""
CLAIM_APPROVAL_PROMPT = """
You are a medical assistant helping an insurance claim approver. \
You are provided two pieces of information, one about the patient report and second about the medication recieved \

Patient Report : {condition}

Medication : {medication}

Summary 1 : Patient Details Matching
Check the details on Patient info in patient report and medication and check if there is a match.\
Check if the dates on patient report is near to Medication report, or if prescription date is before medical report then report. Apply some math \
Output the values, reasoning if the medical condition and report are not from the same person in tabular format.
Summarize your findings if information doesnt match.
Keep your response for this section within 30 words as much as possible.

Summary 2 : Patient Report and Medication
Step 1 - Deduce the medical condition of patient from Patient Report provided, provide logic
Step 2 - Check if the prescribed medication is correct for the medical condition you deduced in Step 1 \
Please provide your logic if medication is wrong for provided Medical Condition.
Do not use diagnosis provided in the medication. Only use prescribed medication information.
Summarize your findings if information matches.
Keep your response for this section to 100 words as much as possible.

Instruction: generate output in the following format. avoid sending original prompt. go straight to finding.

**Summary 1: Patient Details Matching**

<summary 1>

**Summary 2: Patient Report and Medication**

<summary 2>

Let's think step by step.
"""
CLAIM_APPROVAL_MEDICAL_REPORT_PROMPT_V2 = """
You are a medical assistant aiding an insurance claim approver. Analyze the following information:

Patient Report: {condition}

Medication: {medication}

**Task: Patient Details Consistency**

* **Compare Patient Identifiers:** Compare patient identifiers (name, date of birth, etc.) in both the report and medication records. 
    * **Flag Major Discrepancies:**  Report only substantial mismatches that could indicate different individuals.
    * **Minor Variations:** Ignore minor differences in formatting or punctuation (e.g., "Ms.JohnSmith" vs. John Smith is a minor difference and is acceptable, assuming the other patient details are aligned).
* **Assess Date Alignment:** Check if the prescription date occurs after the medical report date. Only report issues if the prescription date occurs before the medical report date.

**Output Format:**

**Summary: Patient Details Consistency**

* **Key Discrepancies:** List any major mismatches in patient identifiers that raise concerns that the documents are belong to different individuals. If no significant discrepancies are found, state "No major discrepancies found."
* **Date Concerns:** Explain if the prescription date is earlier than the medical report date. If the prescription date occurs on or after the medical report, state "Dates are reasonably aligned."

**Important:**
* Prioritize accuracy over brevity.
* Explain your reasoning clearly.
"""
CLAIM_APPROVAL_PRESCRIPTION_PROMPT_V2 = """
You are a medical assistant aiding an insurance claim approver. Analyze the following information:

Patient Report: {condition}

Medication: {medication}

**Task: Medication Appropriateness**

* **Deduce Diagnosis:** Analyze the patient report *carefully* to deduce the most likely diagnosis. State your reasoning.
* **Medication Evaluation:** Research whether the prescribed medication is a standard treatment for the deduced diagnosis. Explain inconsistencies, if any.

**Output Format:**

**Summary: Medication Appropriateness**

* **Deduced Diagnosis:** [Diagnosis] (Reasoning: ...)
* **Medication Suitability:** [Suitable/Unsuitable] (Reasoning: ...)

**Important:**
* Prioritize accuracy over brevity.
* Explain your reasoning clearly.
"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__MAIN = """
Medical Record: {context}

Read the text above.

Output a table with the following columns : Medical Test, Medical result, Minimum value of reference range, Maximum value of reference range, Flag.

Now compare medical result with refrence values, do some math and be careful. Use patient age as 50.

only if the medical result (without units) is less that Minimum value of reference range. Mark Flag as Low.
only if the medical result (without units) is more that Maximum value of reference range. Mark Flag as High.

**Example:**

If a 50-year-old patient's blood test shows:

* Potassium: 3.0 mmol/L (Reference Range: 3.5 - 5.0 mmol/L)
   * Flag: Low (Potentially significant in this age group)

* GAMMA GT: 24.3 (Reference range: < 55.0)
    * Flag: Normal

Answer: Let's think step by step.

"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__PATIENT_DETAILS = """
Medical Record: {context}

Please find answers for the query below:

Details on the patient such as name, age, gender, and address, date of report.

Generate output in the following format:
Name : <name> \n
Age : <age> \n
Gender : <gender> \n
Date of Report : <date> \n
Address : <address>

Let's think step by step.
"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY_OF_REPORT_AND_PATIENT_DETAILS = """
Use the medical report attached to answer the following query:

Details on the patient such as name, age, gender, and address, date of report.

Generate output in the following format:
Name : <name> \n
Age : <age> \n
Gender : <gender> \n
Date of Report : <date> \n
Address : <address>

Also, output a table with the following columns : Medical Test, Medical result, Minimum value of reference range, Maximum value of reference range, Flag.

Now compare medical result with refrence values, do some math and be careful.

only if the medical result (without units) is less that Minimum value of reference range. Mark Flag as Low.
only if the medical result (without units) is more that Maximum value of reference range. Mark Flag as High.

**Example:**

If the patient's blood test shows:

* Potassium: 3.0 mmol/L (Reference Range: 3.5 - 5.0 mmol/L)
   * Flag: Low (Potentially significant in this age group)

* GAMMA GT: 24.3 (Reference range: < 55.0)
    * Flag: Normal

Let's think step by step. Only include the patient details and the table in the response. Do not include any other information or explanations.
Format your response using Markdown format and optimise it for both human readability and to be fed into MedLM model for further inference.

"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__SUMMARY = """
Read the text in the following medical record attached carefully.

{medical_record}

From the medical record, report medical tests where the flag is "Low" or "High" and the corresponding potential diagnosis associated with the abnormal value. Present your findings as follows:

**Medical Test:**  (Name of the test)
**Medical Result:** (The reported value)
**Reference Range:** (Minimum Value - Maximum Value)
**Flag:** (Low or High)
**Potential Diagnosis:** (Diagnosis)

**Example:**

**Diagnosis 1**
**Medical Test:**  Blood Glucose
**Medical Result:** 130 mg/dL
**Reference Range:** 70 mg/dL - 100 mg/dL
**Flag:** High
**Diagnosis:** Diabetes Mellitus (Type 2)

**Important:**
* Maintain this structure for each abnormal test. 

Answer: 

"""

MEDICAL_REPORT_SUMMARY_PROMPT_V2__2_LINES_SUMMARY = """
Read the text in medical record attached.

As a doctor, generate a 2 lines summary of the medical report.

Answer: Let's think step by step.
"""

CLAIM_OUTCOME_PROMPT = """
You are a helpful assistant who can provide recommendations for an insurance claim approver. \
You are provided two summaries - one for Patient Details Matching and one for Patient Report and Medication. \
Based on the contents of the summaries, decide if the claim should be approved or rejected. Exercise common sense to ensure reasonableness in your conclusion. \

You should only respond with either "Go Ahead for Claim Approval" or "Cannot Approve Claim with the given information".
Keep your response to either of the above phrases only and do not include any additional information or rationale for your answer.

Summary: {summary}
"""

MEDICAL_GLOSSARY_PROMPT = """
You are a helpful assistant to an insurance claim approver who has in depth understanding of medical terminology.

You are provided a query and you need to generate a clear and concise explanation of the query to the insurance claim approver to help them with their claim approval decision.

**Important:**
* Showcase your deep understanding of medical terminology and explore nuances of terms where necessary.
* Explain your reasoning clearly and professionally like a doctor would.
* Use markdown format to optimise for human readability.

Query: {query}
"""