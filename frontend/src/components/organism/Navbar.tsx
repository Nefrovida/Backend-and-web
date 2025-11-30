import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import Notes from "../page/Notes";
import {
  BsPerson,
  BsFillPersonFill,
  BsDoorClosed,
  BsDoorOpenFill,
} from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { IoFlaskSharp, IoFlaskOutline } from "react-icons/io5";
import { RiChatSettingsLine, RiChatSettingsFill } from "react-icons/ri";
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
import ConfirmModal from "../molecules/ConfirmModal";

import { ROLE_IDS } from "../../types/auth.types";
import { authService } from "../../services/auth.service";
import { PiFlaskFill, PiFlaskLight } from "react-icons/pi";
import { ImUserTie } from "react-icons/im";

interface Props {
  children: React.ReactNode;
}

// 1. Shared tooltip logic (hook)
const useTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => setShowTooltip(false);

  return { showTooltip, tooltipPos, ref, handleMouseEnter, handleMouseLeave };
};

// 2. Tooltip visual component (portal)
const Tooltip = ({
  label,
  top,
  left,
}: {
  label: string;
  top: number;
  left: number;
}) => {
  return createPortal(
    <div
      className="fixed z-[9999] px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-md shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200"
      style={{ top, left, transform: "translateY(-50%)" }}
    >
      {label}
      <span className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
    </div>,
    document.body
  );
};

// 3. Links component (routes)
const CustomLink = ({
  to,
  icon,
  activeIcon,
  label,
  end = false,
}: {
  to: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  end?: boolean;
}) => {
  const { showTooltip, tooltipPos, ref, handleMouseEnter, handleMouseLeave } =
    useTooltip();

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
      {showTooltip && (
        <Tooltip label={label} top={tooltipPos.top} left={tooltipPos.left} />
      )}
    </>
  );
};

// 4. Buttons components
const NavButton = ({
  onClick,
  isActive,
  icon,
  activeIcon,
  label,
  activeClass,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  activeClass?: string;
}) => {
  const { showTooltip, tooltipPos, ref, handleMouseEnter, handleMouseLeave } =
    useTooltip();
  const activeStyle =
    activeClass ||
    "bg-blue-50 text-blue-600 scale-105 shadow-sm ring-1 ring-blue-100";

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={onClick}
          className={`
            group relative flex items-center justify-center w-12 h-12 
            transition-all duration-300 ease-out rounded-xl cursor-pointer border-none outline-none
            ${isActive
              ? activeStyle
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:scale-110"
            }
          `}
        >
          <div className="text-2xl transition-transform duration-300">
            {isActive ? activeIcon : icon}
          </div>
        </button>
      </div>
      {showTooltip && (
        <Tooltip label={label} top={tooltipPos.top} left={tooltipPos.left} />
      )}
    </>
  );
};

function Navbar({ children }: Props) {
  const [showNotes, setShowNotes] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = currentUser?.role_id;

  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isDoctor = roleId === ROLE_IDS.DOCTOR;
  const isSecretary = roleId === ROLE_IDS.SECRETARIA;
  const isLaboratorist = roleId === ROLE_IDS.LABORATORIST;
  const isPatient = roleId === ROLE_IDS.PATIENT;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error al hacer logout:", err);
    } finally {
      localStorage.removeItem("user");
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      {/* Floating Navigation Bar */}
      <nav
        className={`
        relative flex flex-col items-center justify-between py-6
        m-4 w-[4.5rem] h-[calc(100vh-2rem)] 
        bg-white/80 backdrop-blur-xl 
        rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        border border-white/40
        transition-all duration-500
        ${showNotes ? "z-[80]" : "z-50"}
      `}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-2 items-center w-full">
          <CustomLink
            label="Mi Perfil"
            to="/dashboard/"
            icon={<BsPerson />}
            activeIcon={<BsFillPersonFill />}
            end
          />
          {isDoctor && (
            <NavButton
              label={showNotes ? "Cerrar Notas" : "Notas"}
              isActive={showNotes}
              onClick={() => setShowNotes(!showNotes)}
              icon={<LuNotebook />}
              activeIcon={<LuNotebookPen />}
              activeClass="bg-green-50 text-green-600 scale-105 shadow-sm ring-1 ring-green-100"
            />
          )}

          <div className="w-8 h-0.5 bg-gray-200/60 rounded-full mt-1"></div>
        </div>

        {/* Scrollable Mid Section */}
        <div className="flex flex-col gap-3 items-center w-full justify-center flex-1 py-4 overflow-y-auto scrollbar-hide px-2">
          {/* Only Admins can see this icons */}
          {isAdmin && (
            <>
              <CustomLink
                label="Registrar Doctor"
                to="/dashboard/registrar-doctor"
                icon={<FaUserMd />}
                activeIcon={<FaUserMd />}
                end
              />
              <CustomLink
                label="Registrar Admin"
                to="/dashboard/registrar-admin"
                icon={<ImUserTie />}
                activeIcon={<ImUserTie />}
                end
              />
            </>
          )}

          {/* Upload Results, only Laboratorist */}
          {isLaboratorist && (
            <CustomLink
              label="Subir Resultados"
              to="/dashboard/laboratorio/subir"
              icon={<FaRegClock />}
              activeIcon={<FaClock />}
              end
            />
          )}

          {/* Expedientes */}
          {isDoctor && (
            <CustomLink
              label="Expedientes"
              to="/dashboard/expedientes"
              icon={<FaRegFolder />}
              activeIcon={<FaFolderOpen />}
              end
            />
          )}

          {/* Forum access EVERYONE */}
          <CustomLink
            label="Foros"
            to="/dashboard/foro"
            icon={<MdOutlineForum />}
            activeIcon={<MdForum />}
            end
          />

          {/* Forum settings ONLY ADMIN*/}
          {isAdmin && (
            <CustomLink
              label="Configuración de Foros"
              to="/dashboard/foros"
              icon={<RiChatSettingsLine />}
              activeIcon={<RiChatSettingsFill />}
              end
            />
          )}
          {/* Agenda */}
          {(isAdmin || isDoctor || isSecretary || isPatient) && (
            <CustomLink
              label="Agenda"
              to="/dashboard/agenda"
              icon={<FaRegClipboard />}
              activeIcon={<FaClipboardCheck />}
              end
            />
          )}

          {/* Laboratory results, Doctor */}
          {isDoctor && (
            <CustomLink
              label="Laboratorio"
              to="/dashboard/laboratorio"
              icon={<IoFlaskOutline />}
              activeIcon={<IoFlaskSharp />}
              end
            />
          )}

          {/* Laboratorista analysis */}
          {isLaboratorist && (
            <CustomLink
              label="Agenda"
              to="/dashboard/analisis-dia"
              icon={<PiFlaskLight />}
              activeIcon={<PiFlaskFill />}
              end
            />
          )}

          {/* Secretary */}
          {isSecretary && (
            <>
              <CustomLink
                label="Agendar Cita"
                to="/dashboard/secretaria/agendar"
                icon={<FaRegClock />}
                activeIcon={<FaClock />}
                end
              />
              <CustomLink
                label="Catálogo Análisis"
                to="/dashboard/analisis"
                icon={<FaRegListAlt />}
                activeIcon={<FaListAlt />}
                end
              />
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2 items-center w-full pb-2">
          <div className="w-8 h-0.5 bg-gray-200/60 rounded-full mb-1"></div>
          <NavButton
            label="Cerrar sesión"
            isActive={false}
            onClick={() => setShowLogoutModal(true)}
            icon={<BsDoorClosed />}
            activeIcon={<BsDoorOpenFill />}
            activeClass="bg-red-50 text-red-600 scale-105 shadow-sm ring-1 ring-red-100"
          />
        </div>
      </nav>

      {/* Backdrop when notes is open */}
      {showNotes && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[60] transition-opacity duration-300"
          onClick={() => setShowNotes(false)}
        />
      )}

      {/* Notes Panel Overlay */}
      <div
        className={`
          fixed top-4 bottom-4 left-[6.5rem] z-[70]
          bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl border border-gray-100
          overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showNotes
            ? "opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-4 pointer-events-none"
          }
        `}
      >
        {/* Intern Container */}
        {isDoctor && (
          <div className="h-full w-fit flex flex-col bg-white">
            <div className="p-5 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <LuNotebookPen size={20} />
                </div>
                <h2 className="font-bold text-gray-800 text-xl">Notas</h2>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0 bg-white relative">
              <Notes />
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        variant="danger"
        title="¿Cerrar sesión?"
        message="Se cerrará tu sesión actual y tendrás que volver a iniciar sesión para acceder de nuevo al sistema."
        confirmLabel="Sí, cerrar sesión"
        cancelLabel="Cancelar"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 h-screen p-4 transition-all duration-300 relative z-10 overflow-auto">
        <div className="h-full min-h-0">{children}</div>
      </main>
    </div>
  );
}

export default Navbar;
