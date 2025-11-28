import { BasicForumInfo } from "@/types/forum.types";
import React, { FC } from "react";

interface Props {
  setForumId: (n: number) => void;
  forums: BasicForumInfo[] | null;
}

const SelectForum: FC<Props> = ({ setForumId, forums }) => {
  return (
    <label htmlFor="forumSelect" className="mt-4 text-lg">
      Elegir foro
      <select
        name=""
        id="forumSelect"
        className="bg-gray-200 w-full p-2 rounded-md mt-1 mb-2"
        defaultValue=""
        onChange={(e) => {
          setForumId(Number(e.target.value));
        }}
      >
        <option value="" disabled>
          Elegir un foro...
        </option>
        {forums &&
          forums.map((f, idx) => (
            <option value={f.forumId} key={idx}>
              {f.name}
            </option>
          ))}
      </select>
    </label>
  );
};

export default SelectForum;
