import { PendingUser } from "@/services/users.service";
import Button from "../atoms/Button";
import UserProfile from "./UserProfile";

const UserListPending = ({
  users,
  formatDate,
  handleApprove,
  handleReject,
}) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <ul className="divide-y divide-gray-200">
      {users.map((user: PendingUser) => (
        <li
          key={user.user_id}
          className="p-6 hover:bg-gray-50 flex justify-between"
        >
          <UserProfile user={user} isPending formatDate={formatDate} />
          <div className="ml-6 flex space-x-3">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(user.user_id, user.name)}
            >
              Aprobar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleReject(user.user_id, user.name)}
            >
              Rechazar
            </Button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UserListPending;
