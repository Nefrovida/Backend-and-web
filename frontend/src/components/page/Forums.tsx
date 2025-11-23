import FeedList from "../organism/forum/FeedList";
import ForumList from "../organism/forum/ForumList";
import ForumSearch from "../organism/forum/ForumSearch";
import NewMessageComponent from "../organism/forum/NewMessageComponent";

const Forums = () => {
  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <ForumSearch />
      <div className="flex w-full border-t-2 border-gray-200 pt-2 flex-grow h-full overflow-hidden">
        <aside className="w-1/6 max-sm:hidden mr-4">
          <ForumList />
        </aside>

        <div className="w-full h-full overflow-hidden">
          <FeedList />
        </div>

        <NewMessageComponent />
      </div>
    </div>
  );
};

export default Forums;
