import Title from "@/components/atoms/Title";
import React from "react";
import { Link } from "react-router-dom";

const ForumSearch = () => {
  return (
    <div className="w-2/3 h-16 flex justify-between items-center">
      <Link to={"/dashboard/foro"}>
        <Title size="large">Foro</Title>
      </Link>
      {/* <ForumSearchBar /> */}
    </div>
  );
};

export default ForumSearch;
