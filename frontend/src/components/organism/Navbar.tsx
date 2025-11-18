import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { IoFlaskSharp, IoFlaskOutline } from "react-icons/io5";
import {
  FaUserMd,
  FaListUl,
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

  return (
    <div className="flex">
      <nav className="w-[3rem] bg-white drop-shadow-md h-screen mr-2 flex flex-col items-center py-2 justify-between text-3xl">
        <NavIcon
          from={<BsPerson />}
          to={<BsFillPersonFill />}
          link="/profile"
          end
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

        <NavIcon
          from={<FaRegFolder />}
          to={<FaFolderOpen />}
          link="/expedientes"
          end
        />

        <NavIcon
          from={<MdOutlineForum />}
          to={<MdForum />}
          link="/foro"
          end
        />

        <NavIcon
          from={<FaRegClipboard />}
          to={<FaClipboardCheck />}
          link="/agenda"
          end
        />

        <NavIcon
          from={<IoFlaskOutline />}
          to={<IoFlaskSharp />}
          link="/laboratorio"
          end
        />

        <NavIcon
          from={<FaRegClock />}
          to={<FaClock />}
          link="/laboratorio/subir"
          end
        />

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