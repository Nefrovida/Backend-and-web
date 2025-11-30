import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaRegFolder,
  FaRegClipboard,
  FaClipboardCheck,
  FaRegClock,
  FaRegListAlt,
} from "react-icons/fa";
import { MdOutlineForum } from "react-icons/md";
import { PiFlaskLight } from "react-icons/pi";
import { IoFlaskOutline } from "react-icons/io5";
import { ROLE_IDS } from "@/types/auth.types";
import QuickAccessCard from "../molecules/QuickAccessCard";
import DoctorDashboardInfo from "./dashboard/DoctorDashboardInfo";

function DashboardHome() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = currentUser?.role_id;

  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isDoctor = roleId === ROLE_IDS.DOCTOR;
  const isSecretary = roleId === ROLE_IDS.SECRETARIA;
  const isLaboratorist = roleId === ROLE_IDS.LABORATORIST;
  const isPatient = roleId === ROLE_IDS.PATIENT;

  useEffect(() => {
    // Actualizar reloj cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  // Accesos rápidos según el rol
  const getQuickAccess = () => {
    const commonAccess = [
      {
        title: "Foros",
        description: "Participa en discusiones y consultas",
        icon: <MdOutlineForum size={24} />,
        onClick: () => navigate("/dashboard/foro"),
        color: "purple",
      },
    ];

    if (isAdmin) {
      return [
        {
          title: "Registrar Doctor",
          description: "Agregar un nuevo médico al sistema",
          icon: <FaUserMd size={24} />,
          onClick: () => navigate("/dashboard/registrar-doctor"),
          color: "blue",
        },
        {
          title: "Configuración de Foros",
          description: "Administrar categorías y permisos",
          icon: <MdOutlineForum size={24} />,
          onClick: () => navigate("/dashboard/foros"),
          color: "indigo",
        },
        {
          title: "Agenda",
          description: "Revisar citas programadas",
          icon: <FaRegClipboard size={24} />,
          onClick: () => navigate("/dashboard/agenda"),
          color: "green",
        },
        ...commonAccess,
      ];
    }

    if (isDoctor) {
      return [
        {
          title: "Expedientes",
          description: "Acceder a historiales médicos",
          icon: <FaRegFolder size={24} />,
          onClick: () => navigate("/dashboard/expedientes"),
          color: "blue",
        },
        {
          title: "Agenda",
          description: "Ver tus citas del día",
          icon: <FaClipboardCheck size={24} />,
          onClick: () => navigate("/dashboard/agenda"),
          color: "green",
        },
        {
          title: "Laboratorio",
          description: "Revisar resultados de análisis",
          icon: <IoFlaskOutline size={24} />,
          onClick: () => navigate("/dashboard/laboratorio"),
          color: "orange",
        },
        ...commonAccess,
      ];
    }

    if (isSecretary) {
      return [
        {
          title: "Agendar Cita",
          description: "Programar nueva cita para paciente",
          icon: <FaRegClock size={24} />,
          onClick: () => navigate("/dashboard/secretaria/agendar"),
          color: "blue",
        },
        {
          title: "Agenda",
          description: "Ver calendario de citas",
          icon: <FaClipboardCheck size={24} />,
          onClick: () => navigate("/dashboard/agenda"),
          color: "green",
        },
        {
          title: "Catálogo Análisis",
          description: "Gestionar tipos de análisis",
          icon: <FaRegListAlt size={24} />,
          onClick: () => navigate("/dashboard/analisis"),
          color: "purple",
        },
        ...commonAccess,
      ];
    }

    if (isLaboratorist) {
      return [
        {
          title: "Subir Resultados",
          description: "Cargar análisis completados",
          icon: <FaRegClock size={24} />,
          onClick: () => navigate("/dashboard/laboratorio/subir"),
          color: "blue",
        },
        {
          title: "Análisis del Día",
          description: "Ver agenda de análisis pendientes",
          icon: <PiFlaskLight size={24} />,
          onClick: () => navigate("/dashboard/analisis-dia"),
          color: "orange",
        },
        ...commonAccess,
      ];
    }

    if (isPatient) {
      return [
        {
          title: "Agenda",
          description: "Ver tus próximas citas",
          icon: <FaClipboardCheck size={24} />,
          onClick: () => navigate("/dashboard/agenda"),
          color: "green",
        },
        ...commonAccess,
      ];
    }

    return commonAccess;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header con saludo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
              <p className="text-blue-100 text-lg">Bienvenido de vuelta</p>
              <p className="text-blue-200 text-sm mt-1">
                {currentTime.toLocaleDateString("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">
                {currentTime.toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas (ejemplo) */}
        {isDoctor && <DoctorDashboardInfo />}

        {/* Accesos rápidos */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getQuickAccess().map((access, index) => (
              <QuickAccessCard key={index} {...access} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
