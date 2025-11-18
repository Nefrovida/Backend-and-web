import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { FaUserMd, FaListUl, FaFolderOpen, FaFolder, FaRegFolder, FaOpencart, FaClipboardCheck, FaRegClipboard } from "react-icons/fa";
import Notas from "../page/Notas";
import { ROLE_IDS } from "../../types/auth.types";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  const [showNotes, setShowNotes] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex">
      <nav className="w-[3rem] bg-white drop-shadow-md h-screen mr-2 flex flex-col items-center py-2 justify-between text-3xl">
        <NavIcon
          from={<BsPerson />}
          to={<BsFillPersonFill />}
          link="/profile"
        />


        {showNotes ? (
          <LuNotebookPen onClick={() => setShowNotes((prev) => !prev)} />
        ) : (
          <LuNotebook onClick={() => setShowNotes((prev) => !prev)} />
        )}

        {currentUser?.role_id === ROLE_IDS.ADMIN && (
          <>
            <NavIcon
              from={<FaUserMd />}
              to={<FaUserMd />}
              link="/register-doctor"
            />
            <NavIcon
              from={<FaListUl />}
              to={<FaListUl />}
              link="/doctors"
            />
          </>
        )}

        <NavIcon
          from={<FaRegFolder />}
          to={<FaFolderOpen/>}
          link="/expedientes"
        />

        <NavIcon
          from={<MdOutlineForum />}
          to={<MdForum />}
          link="/foro"
        />

        <NavIcon
          from={<FaRegClipboard />}
          to={<FaClipboardCheck />}
          link="/agenda"
        />

        <NavIcon
          from={<BsGear />}
          to={<BsGearFill />}
          link="/settings"
        />
      </nav>

      <Notas className={showNotes ? "" : "hidden"} />
      {children}
    </div>
  );
}

export default Navbar;