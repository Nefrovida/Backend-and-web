import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { IoFlaskSharp, IoFlaskOutline } from "react-icons/io5";
import {
  FaUserMd,
  FaListAlt,
  FaRegListAlt,
  FaFolderOpen,
  FaRegFolder,
  FaClipboardCheck,
  FaRegClipboard,
  FaRegClock,
  FaClock,
} from "react-icons/fa";

import { ROLE_IDS } from "../../types/auth.types";

interface Props {
  children: React.ReactNode;
}

// --- 1. Shared Tooltip Logic (hook) ---
const useTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos({ 
        top: rect.top + rect.height / 2, 
        left: rect.right + 10 
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => setShowTooltip(false);

  return { showTooltip, tooltipPos, ref, handleMouseEnter, handleMouseLeave };
};

// --- 2. Visual Component Tooltip (portal) ---
const Tooltip = ({ label, top, left }: { label: string, top: number, left: number }) => {
  return createPortal(
    <div 
      className="fixed z-[9999] px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-md shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200"
      style={{ top, left, transform: 'translateY(-50%)' }}
    >
      {label}
      <span className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
    </div>,
    document.body
  );
};

// --- 3. Component for Links (routes) ---
const CustomLink = ({ 
  to, icon, activeIcon, label, end = false
}: { 
  to: string; icon: React.ReactNode; activeIcon: React.ReactNode; label: string; end?: boolean;
}) => {
  const { showTooltip, tooltipPos, ref, handleMouseEnter, handleMouseLeave } = useTooltip();

  return (
    <>
      <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <NavLink 
          to={to} 
          end={end}
          className={({ isActive }) => `
            group relative flex items-center justify-center w-12 h-12 
            transition-all duration-300 ease-out rounded-xl cursor-pointer
            ${isActive 
              ? "bg-blue-50 text-blue-600 scale-105 shadow-sm ring-1 ring-blue-100" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:scale-110" 
            }
          `}
        >
          {({ isActive }) => (
            <div className="text-2xl transition-transform duration-300">
              {isActive ? activeIcon : icon}
            </div>
          )}
        </NavLink>
      </div>
      {showTooltip && <Tooltip label={label} top={tooltipPos.top} left={tooltipPos.left} />}
    </>
  );
};

function Navbar({ children }: Props) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = currentUser?.role_id;

  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isDoctor = roleId === ROLE_IDS.DOCTOR;
  const isSecretary = roleId === ROLE_IDS.SECRETARIA;
  const isLaboratorist = roleId === ROLE_IDS.LABORATORIST;
  const isPatient = roleId === ROLE_IDS.PATIENT;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      
      {/* --- Floating NavBar --- */}
      <nav className="
        relative z-40 flex flex-col items-center justify-between py-6
        m-4 w-[4.5rem] h-[calc(100vh-2rem)] 
        bg-white/80 backdrop-blur-xl 
        rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        border border-white/40
        transition-all duration-500
      ">
        
        {/* Top Section */}
        <div className="flex flex-col gap-2 items-center w-full">
            <CustomLink 
              label="Perfil"
              to="/"
              icon={<BsPerson />}
              activeIcon={<BsFillPersonFill />}
              end
            />
            <div className="w-8 h-0.5 bg-gray-200/60 rounded-full mt-1"></div>
        </div>

        {/* Scrollable Central Section */}
        <div className="flex flex-col gap-3 items-center w-full justify-center flex-1 py-4 overflow-y-auto scrollbar-hide px-2">
          
          {/* Notes */}
          <CustomLink 
            label="Notas"
            to="/notas"
            icon={<LuNotebook />}
            activeIcon={<LuNotebookPen />}
            end
          />

          {/* Register doctor - Only Admin Can See This */}
          {isAdmin && (
            <CustomLink 
              label="Registrar Doctor"
              to="/register-doctor"
              icon={<FaUserMd />}
              activeIcon={<FaUserMd />} 
              end
            />
          )}

          {/* Expedientes */}
          <CustomLink 
            label="Expedientes"
            to="/expedientes"
            icon={<FaRegFolder />}
            activeIcon={<FaFolderOpen />}
            end
          />

          {/* Forum */}
          <CustomLink 
            label="Foro Comunitario"
            to="/foro"
            icon={<MdOutlineForum />}
            activeIcon={<MdForum />}
            end
          />

          {/* Agenda */}
          {(isAdmin || isDoctor || isSecretary || isPatient) && (
            <CustomLink 
              label="Agenda"
              to="/agenda"
              icon={<FaRegClipboard />}
              activeIcon={<FaClipboardCheck />}
              end
            />
          )}

          {/* Laboratory */}
          {(isLaboratorist || isAdmin) && (
            <>
              <CustomLink 
                label="Laboratorio"
                to="/laboratorio"
                icon={<IoFlaskOutline />}
                activeIcon={<IoFlaskSharp />}
                end
              />
              <CustomLink 
                label="Subir Resultados"
                to="/laboratorio/subir"
                icon={<FaRegClock />}
                activeIcon={<FaClock />}
                end
              />
            </>
          )}

          {/* Secretary */}
          {isSecretary && (
            <>
              <CustomLink 
                label="Agendar Cita"
                to="/secretaria/agendar"
                icon={<FaRegClock />}
                activeIcon={<FaClock />}
                end
              />
              <CustomLink 
                label="Catálogo Análisis"
                to="/analisis"
                icon={<FaRegListAlt />}
                activeIcon={<FaListAlt />}
                end
              />
            </>
          )}
        </div>

        {/* Botton Section */}
        <div className="flex flex-col gap-2 items-center w-full pb-2">
            <div className="w-8 h-0.5 bg-gray-200/60 rounded-full mb-1"></div>
            <CustomLink 
              label="Configuración"
              to="/"
              icon={<BsGear />}
              activeIcon={<BsGearFill />}
              end
            />
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-auto p-4 transition-all duration-300 relative z-0">
        {children}
      </main>
    </div>
  );
}

export default Navbar;