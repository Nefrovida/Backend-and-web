import React from "react";

interface Props {
  children: React.ReactNode;
}

function Navbar({ children }: Props) {
  return (
    <div className="flex">
      <nav className="w-[5rem] bg-white drop-shadow-md h-screen mr-2 flex flex-col"></nav>
      {children}
    </div>
  );
}

export default Navbar;
