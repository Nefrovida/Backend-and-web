import { useParams } from "react-router-dom";
import FeedList from "../organism/forum/FeedList";
import ForumList from "../organism/forum/ForumList";
import ForumSearch from "../organism/forum/ForumSearch";
import NewMessageComponent from "../organism/forum/NewMessageComponent";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Message } from "@/types/forum.types";

const Forums = () => {
  const { forumId } = useParams();

  let fId = Number(forumId);
  if (isNaN(fId)) {
    fId = null;
  }

  const messageInfo = useInfiniteScroll<Message>(
    `/api/forums/feed`,
    [fId],
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (fId) params.append("forumId", fId.toString());
      return params.toString();
    }
  );

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <ForumSearch />
      <div className="flex w-full border-t-2 border-gray-200 pt-2 flex-grow h-full overflow-hidden">
        <aside className="w-1/6 max-sm:hidden mr-4">
          <ForumList />
        </aside>

        <div className="w-full h-full">
          <FeedList messageInfo={messageInfo} />
        </div>

        <NewMessageComponent />
      </div>
    </div>
  );
};

export default Forums;
