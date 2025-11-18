import Pill from "@/components/atoms/Pill";
import React, { FC } from "react";

interface Props {
  handleCancel: () => void;
  handleSent: () => void;
}

const SubmitButtons: FC<Props> = ({ handleCancel, handleSent }) => {
  return (
    <div className="w-full flex justify-end mt-10">
      <div className="flex gap-5 w-1/2">
        <Pill
          text={"Cancelar"}
          onClick={() => handleCancel()}
          className="bg-gray-200 hover:bg-gray-300 w-1/2"
        />
        <Pill
          text={"Enviar"}
          onClick={() => handleSent()}
          className="bg-green-400 hover:bg-green-500 w-1/2"
        />
      </div>
    </div>
  );
};

export default SubmitButtons;
