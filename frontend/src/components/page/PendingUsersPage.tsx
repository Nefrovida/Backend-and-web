import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  deleteUser,
  getExternalUsers,
  convertExternalToPatient,
  type User,
} from "@/services/admin.service";
import {
  usersService,
  type PendingUser,
} from "../../services/users.service";

type ViewMode = "pending" | "all" | "external";

// 👇 Mapeo de roles desde role_id
const roleName = (id: number) => {
  switch (id) {
    case 1: return "Administrador";
    case 2: return "Doctor";
    case 3: return "Paciente";
    case 4: return "Laboratorista";
    case 5: return "Familiar";
    case 6: return "Secretaria";
    default: return "Desconocido";
  }
};

function PendingUsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("pending");

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [externalUsers, setExternalUsers] = useState<User[]>([]);

  const [selectedRole, setSelectedRole] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // ============================
  // ⚡ Activar carga cuando cambia pestaña
  // ============================
  useEffect(() => {
    setError("");
    setSelectedRole("all");
    setPendingUsers([]);
    setAllUsers([]);
    setExternalUsers([]);
    setLoading(true);

    if (viewMode === "pending") fetchPendingUsers();
    if (viewMode === "all") fetchAllUsers();
    if (viewMode === "external") fetchExternalUsers();
  }, [viewMode]);

  const fetchPendingUsers = async () => {
    try {
      const users = await usersService.getPendingUsers();
      setPendingUsers(users);
    } catch (err: any) {
      setError(err?.message || "Error al cargar usuarios pendientes");
    } finally { setLoading(false); }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (err: any) {
      setError(err?.message || "Error al cargar todos los usuarios");
    } finally { setLoading(false); }
  };

  const fetchExternalUsers = async () => {
    try {
      const users = await getExternalUsers();
      setExternalUsers(users);
    } catch (err: any) {
      setError(err?.message || "Error al cargar usuarios externos");
    } finally { setLoading(false); }
  };

  // ============================
  // 🛠 Acciones
  // ============================
  const handleApprove = async (userId: string, userName: string) => {
    if (!confirm(`¿Aprobar a ${userName}?`)) return;
    try {
      await usersService.approveUser(userId);
      setSuccessMessage(`Usuario ${userName} aprobado`);
      fetchPendingUsers();
    } catch (err: any) { setError(err?.message || "Error al aprobar usuario"); }
  };

  const handleReject = async (userId: string, userName: string) => {
    if (!confirm(`¿Rechazar a ${userName}?`)) return;
    try {
      await usersService.rejectUser(userId);
      setSuccessMessage(`Usuario ${userName} rechazado`);
      fetchPendingUsers();
    } catch (err: any) { setError(err?.message || "Error al rechazar usuario"); }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Eliminar definitivamente a ${userName}?`)) return;
    try {
      await deleteUser(userId);
      setSuccessMessage(`Usuario ${userName} eliminado`);
      setAllUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch (err: any) { setError(err?.message || "Error al eliminar usuario"); }
  };

  const handleConvertExternal = async (userId: string, userName: string) => {
    if (!confirm(`¿Convertir a ${userName} en paciente?`)) return;
    try {
      await convertExternalToPatient(userId);
      setSuccessMessage(`Usuario ${userName} ahora es paciente`);
      fetchExternalUsers();
    } catch (err: any) { setError(err?.message || "Error al convertir usuario externo"); }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  // ============================
  // Loader
  // ============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto" />
          <p className="mt-4 text-gray-600">
            Cargando información...
          </p>
        </div>
      </div>
    );
  }

  // ============================
  // Render
  // ============================
  const filteredUsers =
    selectedRole === "all" ? allUsers : allUsers.filter((u) => u.role_id === selectedRole);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="mt-2 text-gray-600">Administra usuarios del sistema.</p>
          </div>

          {/* Tabs */}
          <div className="inline-flex rounded-md bg-gray-200 p-1">
            <button
              className={`px-4 py-2 text-sm rounded-md ${viewMode === "pending" ? "bg-white shadow text-blue-700" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setViewMode("pending")}
            >Pendientes</button>

            <button
              className={`px-4 py-2 text-sm rounded-md ${viewMode === "all" ? "bg-white shadow text-blue-700" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setViewMode("all")}
            >Todos</button>

            <button
              className={`px-4 py-2 text-sm rounded-md ${viewMode === "external" ? "bg-white shadow text-blue-700" : "text-gray-700 hover:text-gray-900"}`}
              onClick={() => setViewMode("external")}
            >Externos</button>
          </div>
        </div>

        {/* Mensajes */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ===================== */}
        {/* Pendientes */}
        {/* ===================== */}
        {viewMode === "pending" && (
          pendingUsers.length === 0 ? (
            <Empty message="No hay usuarios pendientes" />
          ) : (
            <UserListPending
              users={pendingUsers}
              formatDate={formatDate}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          )
        )}

        {/* ===================== */}
        {/* TODOS */}
        {/* ===================== */}
        {viewMode === "all" && (
          <>
            {/* Filtro */}
            <div className="mb-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="px-3 py-2 border rounded-md shadow-sm bg-white"
              >
                <option value="all">Todos los roles</option>
                <option value="1">Administrador</option>
                <option value="2">Doctor</option>
                <option value="3">Paciente</option>
                <option value="4">Laboratorista</option>
                <option value="5">Familiar</option>
                <option value="6">Secretaria</option>
              </select>
            </div>

            {filteredUsers.length === 0 ? (
              <Empty message="No hay usuarios registrados" />
            ) : (
              <UserListAll
                users={filteredUsers}
                handleDelete={handleDeleteUser}
              />
            )}
          </>
        )}

        {/* ===================== */}
        {/* EXTERNOS */}
        {/* ===================== */}
        {viewMode === "external" && (
          externalUsers.length === 0 ? (
            <Empty message="No hay usuarios externos" />
          ) : (
            <UserListExternal
              users={externalUsers}
              handleConvert={handleConvertExternal}
            />
          )
        )}

      </div>
    </div>
  );
}

/* ============ Componentes Reutilizables ================= */

const Empty = ({ message }: { message: string }) => (
  <div className="bg-white rounded-lg shadow p-12 text-center">
    <h3 className="text-lg text-gray-900 font-medium">{message}</h3>
    <p className="text-gray-500 text-sm">No hay información disponible.</p>
  </div>
);

const UserListPending = ({ users, formatDate, handleApprove, handleReject }: any) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <ul className="divide-y divide-gray-200">
      {users.map((user: PendingUser) => (
        <li key={user.user_id} className="p-6 hover:bg-gray-50 flex justify-between">
          <UserProfile user={user} isPending formatDate={formatDate} />
          <div className="ml-6 flex space-x-3">
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(user.user_id, user.name)}>Aprobar</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleReject(user.user_id, user.name)}>Rechazar</Button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const UserListAll = ({ users, handleDelete }: any) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <ul className="divide-y divide-gray-200">
      {users.map((user: User) => (
        <li key={user.user_id} className="p-6 hover:bg-gray-50 flex justify-between">
          <UserProfile user={user} />
          <button
            onClick={() => handleDelete(user.user_id, user.name)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >Eliminar</button>
        </li>
      ))}
    </ul>
  </div>
);

const UserListExternal = ({ users, handleConvert }: any) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <ul className="divide-y divide-gray-200">
      {users.map((user: User) => (
        <li key={user.user_id} className="p-6 hover:bg-gray-50 flex justify-between">
          <UserProfile user={user} />
          <button
            onClick={() => handleConvert(user.user_id, user.name)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >Convertir a Paciente</button>
        </li>
      ))}
    </ul>
  </div>
);

const UserProfile = ({ user, isPending, formatDate }: any) => (
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
        <span className="text-gray-500 text-xs">Registrado: {formatDate(user.registration_date)}</span>
      )}
    </div>
  </div>
);

const Button = ({ children, className, ...props }: any) => (
  <button {...props} className={`px-4 py-2 text-sm font-medium rounded-md text-white ${className}`} >
    {children}
  </button>
);

export default PendingUsersPage;