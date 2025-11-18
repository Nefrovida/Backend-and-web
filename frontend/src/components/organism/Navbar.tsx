import React, { useState } from "react";
import NavIcon from "../atoms/NavIcon";

import { BsPerson, BsFillPersonFill, BsGear, BsGearFill, BsCalendar, BsCalendarFill } from "react-icons/bs";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

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

        <NavIcon
          from={<BsCalendar />}
          to={<BsCalendarFill />}
          link={"/agenda"} 
          option={"agenda"}
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
      {children}
    </div>
  );
}

export default Navbar;
