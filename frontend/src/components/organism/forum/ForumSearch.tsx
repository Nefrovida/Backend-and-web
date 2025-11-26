import ForumSearchBar from "@/components/atoms/forum/ForumSearchBar";
import Title from "@/components/atoms/Title";
import React from "react";

const ForumSearch = () => {
  return (
    <div className="w-2/3 h-16 flex justify-between items-center">
      <Title size="large">Feed</Title>
      <ForumSearchBar />
    </div>
  );
};

export default ForumSearch;
