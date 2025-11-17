import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PersonalInfoSection from "../organism/medical-record/PersonalInfoSection";
import MedicalHistorySection from "../organism/medical-record/MedicalHistorySection";
import LabResultsSection from "../organism/medical-record/LabResultsSection";
import {
  MedicalRecordFormData,
  PersonalInfoFormData,
  MedicalHistoryFormData,
  LabResultFormData,
} from "../../types/expediente.types";

const MedicalRecordFormPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [currentSection, setCurrentSection] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<MedicalRecordFormData>({
    personalInfo: {
      name: "",
      parent_last_name: "",
      maternal_last_name: "",
      curp: "",
      birthday: "",
      gender: "",
      phone_number: "",
      address: "",
    },
    medicalHistory: {
      allergies: "",
      previous_illnesses: "",
      previous_surgeries: "",
      previous_hospitalizations: "",
      current_medications: "",
      previous_medications: "",
      drug_consumption: "",
      other_conditions: "",
    },
    labResult: {
      file: null,
      interpretation: "",
    },
  });

  const sections = [
    {
      title: "Información Personal",
      component: (
        <PersonalInfoSection
          data={formData.personalInfo}
          onChange={(data) =>
            setFormData((prev) => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, ...data },
            }))
          }
          profileImage={profileImage}
          onImageChange={(file) => {
            setProfileFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfileImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            } else {
              setProfileImage(null);
            }
          }}
        />
      ),
    },
    {
      title: "Antecedentes Médicos",
      component: (
        <MedicalHistorySection
          data={formData.medicalHistory}
          onChange={(data) =>
            setFormData((prev) => ({
              ...prev,
              medicalHistory: { ...prev.medicalHistory, ...data },
            }))
          }
        />
      ),
    },
    {
      title: "Resultados de Laboratorio",
      component: (
        <LabResultsSection
          data={formData.labResult}
          onChange={(data) =>
            setFormData((prev) => ({
              ...prev,
              labResult: { ...prev.labResult, ...data },
            }))
          }
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Connect to backend - Create patient and medical record
      console.log("Patient ID:", patientId);
      console.log("Form data to submit:", formData);
      console.log("Profile image file:", profileFile);
      
      if (!patientId) {
        alert("Error: No se proporcionó el ID del paciente");
        return;
      }
      
      alert("Expediente creado exitosamente (pendiente conectar con backend)");
      navigate(`/expediente/${patientId}`); // Navigate to view page after creation
    } catch (error) {
      console.error("Error creating medical record:", error);
      alert("Error al crear el expediente");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Crear Expediente Médico
          </h1>
          <p className="text-gray-600">
            Sección {currentSection + 1} de {sections.length}: {sections[currentSection].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentSection
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div
                    className={`h-1 w-20 mx-2 ${
                      index < currentSection ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Section Content */}
        <div className="mb-8">{sections[currentSection].component}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentSection === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Siguiente
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordFormPage;
