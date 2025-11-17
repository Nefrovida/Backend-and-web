import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import { FaUserMd, FaListUl } from "react-icons/fa";
import Notas from "../page/Notas";
import { ROLE_IDS } from "../../types/auth.types";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  function handleHover(key: string) {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <div className="flex">
      <nav className="w-[3rem] bg-white drop-shadow-md h-screen mr-2 flex flex-col items-center py-2 justify-between text-3xl">
        <NavIcon
          from={<BsPerson />}
          to={<BsFillPersonFill />}
          link={"/profile"}
          option={"profile"}
          selected={selected}
          onHover={handleHover}
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
              link={"/register-doctor"}
              option={"register-doctor"}
              selected={selected}
              onHover={handleHover}
            />
            <NavIcon
              from={<FaListUl />}
              to={<FaListUl />}
              link={"/doctors"}
              option={"doctors"}
              selected={selected}
              onHover={handleHover}
            />
          </>
        )}

        <NavIcon
          from={<BsGear />}
          to={<BsGearFill />}
          link={"/settings"}
          option={"settings"}
          selected={selected}
          onHover={handleHover}
        />
      </nav>

      <Notas className={showNotes ? "" : "hidden"} />
      {children}
    </div>
  );
}

export default Navbar;