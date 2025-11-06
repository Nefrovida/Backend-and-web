import { FC, ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  from: ReactNode;
  to: ReactNode;
  link: string;
  option: string;
  selected: Record<string, boolean>;
  onHover: (key: string) => void;
}

const NavIcon: FC<Props> = ({ from, to, link, option, selected, onHover }) => {
  return (
    <Link
      to={link}
      onMouseEnter={() => onHover(option)}
      onMouseLeave={() => onHover(option)}
    >
      {selected[option] ? to : from}
    </Link>
  );
};

export default NavIcon;
