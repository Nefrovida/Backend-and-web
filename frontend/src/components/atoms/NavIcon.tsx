import { FC, ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  from: ReactNode;
  to: ReactNode;
  link: string;
}

const NavIcon: FC<Props> = ({ from, to, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="my-2 flex items-center justify-center"
    >
      {({ isActive }) => (isActive || isHovered ? to : from)}
    </NavLink>
  );
};

export default NavIcon;
