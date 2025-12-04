// 👇 Mapeo de roles desde role_id
const roleName = (id: number) => {
  switch (id) {
    case 1:
      return "Administrador";
    case 2:
      return "Doctor";
    case 3:
      return "Paciente";
    case 4:
      return "Laboratorista";
    case 5:
      return "Familiar";
    case 6:
      return "Secretaria";
    default:
      return "Desconocido";
  }
};

const UserProfile = ({ user, isPending, formatDate }) => (
  <div className="flex-1">
    <h3 className="text-lg text-gray-900 font-semibold">
      {user.name} {user.parent_last_name} {user.maternal_last_name}
    </h3>

    <div className="mt-2 text-sm text-gray-500 flex space-x-4">
      <span>{user.username}</span>
      <span>{user.phone_number}</span>
    </div>

    <div className="mt-2 text-sm flex space-x-4">
      {user.role && (
        <span className="px-2 py-0.5 bg-blue-100 rounded-full text-blue-800 text-xs font-medium">
          {roleName(user.role.role_id || user.role_id)}
        </span>
      )}
      {isPending && (
        <span className="text-gray-500 text-xs">
          Registrado: {formatDate(user.registration_date)}
        </span>
      )}
    </div>
  </div>
);

export default UserProfile;
