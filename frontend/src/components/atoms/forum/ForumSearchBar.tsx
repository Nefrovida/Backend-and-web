import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";

const ForumSearchBar = () => {
  const [active, setActive] = useState<boolean>(false);

  return (
    <div
      className={`flex justify-between items-center rounded-md px-2 ${
        active ? "bg-gray-200" : "bg-gray-300"
      } `}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        if (
          !document.activeElement ||
          document.activeElement.tagName !== "INPUT"
        )
          setActive(false);
      }}
    >
      <input
        type="text"
        placeholder="Nombre del foro..."
        className={`px-4 py-2 flex w-96 bg-transparent focus:outline-none`}
      />
      <BsSearch className="size-6" />
    </div>
  );
};

export default ForumSearchBar;
