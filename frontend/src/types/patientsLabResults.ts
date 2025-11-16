import { ANALYSIS_STATUS } from "./Analysis_status";


type patientLabResults = {
  patient_analysis_id: Number,
  analysis_date: Date,
  results_date: Date,
  analysis_status: ANALYSIS_STATUS,
  patient: {
    user: {
      name: String,
      parent_last_name: String,
      maternal_last_name: String
    }
  }  
}

export default patientLabResults;