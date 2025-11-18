import prisma from '../util/prisma'; 


const calculateAge = (birthday: Date): number => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

//Rebooting data so the backend can read it properly
const formatAppointmentData = (dbData: any): any => {
  if (!dbData) return null;

  const patientUser = dbData.patient.user;
  const lastAnalysis = dbData.patient.patient_analyses[0]; // El último análisis
  const lastResult = lastAnalysis?.results[0]; // El resultado de ese análisis

  // Rebooting date and time formats
  const date = new Date(dbData.date_hour);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  
  const endTime = new Date(date.getTime() + dbData.duration * 60000).toLocaleTimeString('es-ES', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  // Frontend awaits time to be in a specific structure
  return {
    id: dbData.patient_appointment_id.toString(), 
    date: formattedDate, 
    schedule: `${formattedTime} - ${endTime}`, 
    reason: dbData.appointments.name, 
    consulting_room: dbData.place ? parseInt(dbData.place, 10) : 10,

    
    patient: {
      name: `${patientUser.name} ${patientUser.parent_last_name} ${patientUser.maternal_last_name || ''}`.trim(),
      age: calculateAge(patientUser.birthday),
      genre: patientUser.gender,
      diagnostic: 'Nefritis',
      LastAnalisisUrl: lastResult?.route || 'Ramon_MacGar011025.pdf' 
    }
  };
};

/**
 * Obtaining appointment details by its ID
 */
export const getAppointmentDetailsById = async (id: string) => {
  try {
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      throw new Error('ID de cita inválido. Debe ser un número.');
    }

    // DB consulting by prisma
    const dbData = await prisma.patient_appointment.findUnique({
      where: {
        patient_appointment_id: appointmentId
      },
      
      include: {
        appointments: true, 
        patient: {
          include: {
            user: true, 
            patient_analyses: {
              orderBy: {
                analysis_date: 'desc' 
              },
              take: 1, // Just the last analysis
              include: {
                results: { 
                  take: 1
                } 
              }
            },
          }
        }
      }
    });

    if (!dbData) {
      return null; // Controller will handle the 404 response if there's no data
    }

    // Format data for frontend
    return formatAppointmentData(dbData);
    
  } catch (error) {
    console.error("Error en el servicio getAppointmentDetailsById:", error);
    throw error;
  }
};