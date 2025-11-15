import Title from "@/components/atoms/Title";
import React, { FC, useEffect } from "react";

interface Props {
  onClick: () => void;
}

const NewMessageModal: FC<Props> = ({ onClick }) => {
  useEffect(() => {}, []);

  return (
    <section
      className="absolute top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-55 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="bg-white w-1/3 h-2/3 rounded-xl p-4">
        <Title>Nuevo Mensaje</Title>
        <select name="" id=""></select>
      </div>
    </section>
  );
};

export default NewMessageModal;
