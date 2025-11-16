import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill } from "react-icons/bs";
import { MdForum, MdOutlineForum } from "react-icons/md";
import { LuNotebook, LuNotebookPen } from "react-icons/lu";
import Notas from "../page/Notas";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState(false);

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
        <NavIcon
          from={<MdOutlineForum />}
          to={<MdForum />}
          link={"/foro"}
          option={"foro"}
          selected={selected}
          onHover={handleHover}
        />
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
