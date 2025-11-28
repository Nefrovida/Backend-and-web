import Title from "@/components/atoms/Title";
import SelectForumCard from "@/components/atoms/forum/SelectForumCard";
import Loading from "@/components/molecules/Loading";
import { BasicForumInfo } from "@/types/forum.types";
import React, { useEffect, useState } from "react";

const ForumList = () => {
  const [forums, setForums] = useState<BasicForumInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/forums/myForums")
      .then((res) => {
        if (!res.ok) {
          console.log("Error in response");
        }
        return res.json();
      })
      .then((data) => {
        data = data.map(({ forum_id, name }) => ({
          forumId: forum_id,
          name: name,
        }));
        setForums(data);
      })
      .catch()
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Title size={"medium"}>Foros</Title>
      <ul className="flex flex-col gap-2">
        {isLoading && <Loading />}
        {forums.length > 0 &&
          !isLoading &&
          forums.map((f, idx) => <SelectForumCard forum={f} key={idx} />)}
      </ul>
    </>
  );
};

export default ForumList;
