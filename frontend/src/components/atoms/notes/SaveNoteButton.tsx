import React, { FC } from "react";
import Pill from "../Pill";

interface Props {
  isLoading: boolean;
  save: () => void;
}

const SaveNoteButton: FC<Props> = ({ isLoading, save }) => {
  return (
    <Pill
      text={isLoading ? "Cargando..." : "Guardar"}
      onClick={save}
      className="bg-green-300 hover:bg-green-400"
    />
  );
};

export default SaveNoteButton;
