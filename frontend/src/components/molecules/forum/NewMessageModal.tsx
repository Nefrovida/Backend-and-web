import Pill from "@/components/atoms/Pill";
import TextArea from "@/components/atoms/TextArea";
import Title from "@/components/atoms/Title";
import React, { FC, useEffect, useState } from "react";

interface Props {
  onClick: () => void;
}

const NewMessageModal: FC<Props> = ({ onClick }) => {
  const [content, setContent] = useState<string>("");
  useEffect(() => {}, []);

  function handleCancel(): void {
    throw new Error("Function not implemented.");
  }

  function handleSent(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section
      className="absolute top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-55 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="bg-white w-1/3 h-2/3 rounded-xl p-4">
        <Title>Nuevo Mensaje</Title>
        <label htmlFor="forumSelect" className="mt-4 text-lg">
          Elegir foro
          <select
            name=""
            id="forumSelect"
            className="bg-gray-200 w-full p-2 rounded-md mt-1 mb-2"
            defaultValue=""
          >
            <option value="" disabled>
              Elegir un foro...
            </option>
          </select>
        </label>

        <h2 className="text-lg mb-1">Mensaje</h2>
        <TextArea
          onChange={setContent}
          value={content}
          maxLength={2000}
          className="h-52"
        />
        <div className="w-full flex justify-end mt-7">
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
      </div>
    </section>
  );
};

export default NewMessageModal;
