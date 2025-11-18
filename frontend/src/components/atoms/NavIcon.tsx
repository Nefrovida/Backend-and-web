import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  from: ReactNode;
  to: ReactNode;
  link: string;
  end?: boolean;
}

const NavIcon: FC<Props> = ({ from, to, link, end }) => {
  return (
    <NavLink
      to={link}
      end={end}
      className="my-2 flex items-center justify-center group"
    >
      {({ isActive }) => (
        <div className="relative flex items-center justify-center">
          {/* Default / inactive icon */}
          <span
            className={`
              transition-opacity duration-150
              ${isActive ? "opacity-0" : "opacity-100"}
              group-hover:opacity-0
            `}
          >
            {from}
          </span>

          {/* Filled / active icon */}
          <span
            className={`
              absolute transition-opacity duration-150
              ${isActive ? "opacity-100" : "opacity-0"}
              group-hover:opacity-100
            `}
          >
            {to}
          </span>
        </div>
      )}
    </NavLink>
  );
};

export default NavIcon;
