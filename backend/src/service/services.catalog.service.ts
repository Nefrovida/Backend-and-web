import Analysis from "../model/analysis/scheduleAnalysis.model";
import AppointmentModel from "../model/appointment.model";

export const getServices = async () => {

    const analysis = await Analysis.getAnalysisCatalog();
    const appointments = await AppointmentModel.getAppointmentCatalog();

    const analysisArray = []
    const appointmentArray = []

    for(const appointment of appointments){
        appointmentArray.push(parseAppointment(appointment))
    }

    for(const indAnalysis of analysis){
        analysisArray.push(parseAnalysis(indAnalysis))
    }

    const data = [appointmentArray, analysisArray]

  return data;
};

function parseAnalysis(analysis) {
  return {
    name: analysis.name,
    general_cost: analysis.general_cost,
    community_cost: analysis.community_cost
  }
}

function parseAppointment(appointment) {
  return {
    name: appointment.name,
    general_cost: appointment.general_cost,
    community_cost: appointment.community_cost,
    doctor: appointment.doctor.user.name + " " + appointment.doctor.user.parent_last_name
  }
}


