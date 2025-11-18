import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { IoFlaskSharp, IoFlaskOutline } from "react-icons/io5";
import {
  FaUserMd,
  FaListUl,
  FaListAlt,
  FaRegListAlt,
  FaFolderOpen,
  FaRegFolder,
  FaClipboardCheck,
  FaRegClipboard,
  FaRegClock,
  FaClock,
} from "react-icons/fa";
import Notas from "../page/Notas";
import { ROLE_IDS } from "../../types/auth.types";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  const [showNotes, setShowNotes] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const roleId = currentUser?.role_id;
  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isDoctor = roleId === ROLE_IDS.DOCTOR;
  const isSecretary = roleId === ROLE_IDS.SECRETARIA;
  const isLaboratorist = roleId === ROLE_IDS.LABORATORIST;
  const isPatient = roleId === ROLE_IDS.PATIENT;

  return (
    <div className="flex">
      <nav className="w-[3rem] bg-white drop-shadow-md h-screen mr-2 flex flex-col items-center py-2 justify-between text-3xl">
        {/* Profile: EVERYONE */}
        <NavIcon
          from={<BsPerson />}
          to={<BsFillPersonFill />}
          link="/profile"
          end
        />

        {/* Notes pending */}
        {showNotes ? (
          <LuNotebookPen onClick={() => setShowNotes((prev) => !prev)} />
        ) : (
          <LuNotebook onClick={() => setShowNotes((prev) => !prev)} />
        )}

        {/* ADMIN ONLY */}
        {isAdmin && (
          <>
            <NavIcon
              from={<FaUserMd />}
              to={<FaUserMd />}
              link="/register-doctor"
              end
            />
            <NavIcon
              from={<FaListUl />}
              to={<FaListUl />}
              link="/doctors"
              end
            />
          </>
        )}

        {/* Expedientes pending */}
        <NavIcon
          from={<FaRegFolder />}
          to={<FaFolderOpen />}
          link="/expedientes"
          end
        />

        {/* Foro: EVERYONE */}
        <NavIcon
          from={<MdOutlineForum />}
          to={<MdForum />}
          link="/foro"
          end
        />

        {/* Agenda: doctors, patients, secretary and admin */}
        {(isAdmin || isDoctor || isSecretary || isPatient) && (
          <NavIcon
            from={<FaRegClipboard />}
            to={<FaClipboardCheck />}
            link="/agenda"
            end
          />
        )}

        {/* Lab main: laboratorist */}
        {(isLaboratorist) && (
          <NavIcon
            from={<IoFlaskOutline />}
            to={<IoFlaskSharp />}
            link="/laboratorio"
            end
          />
        )}

        {/* Lab results upload: laboratorist */}
        {(isLaboratorist) && (
          <NavIcon
            from={<FaRegClock />}
            to={<FaClock />}
            link="/laboratorio/subir"
            end
          />
        )}

        {/* Secretaria agendar: secretary */}
        {(isSecretary) && (
          <NavIcon
            from={<FaRegClock />}
            to={<FaClock />}
            link="/secretaria/agendar"
            end
          />
        )}

        {/* Secretaria analysis types manager: secretary */}
        {(isSecretary) && (
          <NavIcon
            from={<FaRegListAlt />}
            to={<FaListAlt />}
            link="/analisis"
            end
          />
        )}

        {/* Settings: EVERYONE */}
        <NavIcon
          from={<BsGear />}
          to={<BsGearFill />}
          link="/settings"
          end
        />
      </nav>

      <Notas className={showNotes ? "" : "hidden"} />
      {children}
    </div>
  );
}

export default Navbar;