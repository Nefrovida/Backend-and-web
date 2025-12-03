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
    id: analysis.analysis_id,
    name: analysis.name,
    generalCost: analysis.general_cost,
    communityCost: analysis.community_cost,
    description: analysis.description,
    previousRequirements: analysis.previous_requirements,
  }
}

function parseAppointment(appointment) {
  return {
    id: appointment.appointment_id,
    name: appointment.name,
    generalCost: appointment.general_cost,
    communityCost: appointment.community_cost,
    doctor: appointment.doctor.user.name + " " + appointment.doctor.user.parent_last_name,
  }
}


