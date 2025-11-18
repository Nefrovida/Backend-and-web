import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  from: ReactNode;
  to: ReactNode;
  link: string;
  option: string;
  selected: Record<string, boolean>;
  onHover: (key: string, value: boolean) => void;
}

const NavIcon: FC<Props> = ({ from, to, link, option, selected, onHover }) => {
  return (
    <Link
      to={link}
      onMouseEnter={() => onHover(option, true)}
      onMouseLeave={() => onHover(option, false)}
      className="my-2 flex items-center justify-center"
    >
      {selected[option] ? to : from}
    </Link>
  );
};

export default NavIcon;
