import { BasicForumInfo } from "@/types/forum.types";
import React from "react";
import { Link } from "react-router-dom";

const SelectForumCard = ({ forum }: { forum: BasicForumInfo }) => {
  return (
    <Link
      to={`/dashboard/foro/${forum.forumId}`}
      className="w-full border-2 border-light-blue rounded-md bg-white p-2 hover:drop-shadow-md"
    >
      {forum.name}
    </Link>
  );
};

export default SelectForumCard;
