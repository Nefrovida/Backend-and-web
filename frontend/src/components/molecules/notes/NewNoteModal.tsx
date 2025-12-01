import TextArea from "@/components/atoms/TextArea";
import React, { FC } from "react";

const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;
const MAX_ADDITIONAL_NOTES_LENGTH = 2000;

interface Props {
  modalState: React.Dispatch<
    React.SetStateAction<{
      general_notes: string;
      ailments: string;
      prescription: string;
      additional_notes: string;
      visibility: boolean;
    }>
  >;
}

const NewNoteModal: FC<Props> = ({ modalState }) => {
  function handleChange(
    type: "general_notes" | "ailments" | "prescription" | "additional_notes",
    v: string
  ) {
    modalState((prev) => ({
      ...prev,
      [type]: v,
    }));
  }

  return (
    <div className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas adicionales
        </label>
        <TextArea
          className="min-h-[120px] resize-none"
          onChange={(v: string) => handleChange("additional_notes", v)}
          maxLength={MAX_ADDITIONAL_NOTES_LENGTH}
        />
      </div>
    </div>
  );
};

export default NewNoteModal;
