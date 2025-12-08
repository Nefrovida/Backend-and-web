import TextArea from "@/components/atoms/TextArea";
import React, { FC } from "react";

const MAX_TITLE_LENGHT = 200;
const MAX_GENERAL_NOTES_LENGTH = 3000;
const MAX_AILMENTS_LENGTH = 3000;
const MAX_PRESCRIPTION_LENGTH = 3000;

interface Props {
  title: string;
  modalState: React.Dispatch<
    React.SetStateAction<{
      general_notes: string;
      ailments: string;
      prescription: string;
      visibility: boolean;
    }>
  >;
}

const NewNoteModal: FC<Props> = ({ modalState, title }) => {
  function handleChange(
    type: "general_notes" | "ailments" | "prescription" | "title",
    v: string
  ) {
    modalState((prev) => ({
      ...prev,
      [type]: v,
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="title">Titulo</label>
        <input
          className="min-h-9 w-full resize-none text-xl border-2 border-gray-200 rounded-md"
          onChange={(v) => {
            handleChange("title", v.target.value);
          }}
          maxLength={MAX_TITLE_LENGHT}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas generales
        </label>
        <TextArea
          className="min-h-[120px] resize-none"
          onChange={(v: string) => {
            handleChange("general_notes", v);
          }}
          maxLength={MAX_GENERAL_NOTES_LENGTH}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Padecimientos
        </label>
        <TextArea
          className="min-h-[120px] resize-none"
          onChange={(v: string) => handleChange("ailments", v)}
          maxLength={MAX_AILMENTS_LENGTH}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Receta
        </label>
        <TextArea
          className="min-h-[120px] resize-none"
          onChange={(v: string) => handleChange("prescription", v)}
          maxLength={MAX_PRESCRIPTION_LENGTH}
        />
      </div>
    </div>
  );
};

export default NewNoteModal;
