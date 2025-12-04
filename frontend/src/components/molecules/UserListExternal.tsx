import { User } from "@/services/admin.service";
import UserProfile from "./UserProfile";

const UserListExternal = ({ users, handleConvert }) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <ul className="divide-y divide-gray-200">
      {users.map((user: User) => (
        <li
          key={user.user_id}
          className="p-6 hover:bg-gray-50 flex justify-between"
        >
          <UserProfile
            user={user}
            isPending={undefined}
            formatDate={undefined}
          />
          <button
            onClick={() => handleConvert(user.user_id, user.name)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Convertir a Paciente
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default UserListExternal;
