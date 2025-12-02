import { useEffect, useState } from "react";
import { userService, ExternalUser } from "../../services/user.service";
import { authService } from "../../services/auth.service";
import { ROLE_IDS } from "../../types/auth.types";
import { FaUser, FaUserPlus } from "react-icons/fa";

function ExternalUsersListPage() {
  const [users, setUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExternalUser | null>(null);
  const [curp, setCurp] = useState("");
  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadExternalUsers();
  }, []);

  const loadExternalUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getExternalUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios externos");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertClick = (user: ExternalUser) => {
    setSelectedUser(user);
    setCurp("");
    setConversionError(null);
    setShowModal(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !curp) {
      setConversionError("El CURP es requerido");
      return;
    }

    if (curp.length !== 18) {
      setConversionError("El CURP debe tener exactamente 18 caracteres");
      return;
    }

    try {
      setConverting(true);
      setConversionError(null);
      await userService.convertUserToPatient(selectedUser.user_id, curp.toUpperCase());
      
      // Success - reload the list and close modal
      await loadExternalUsers();
      setShowModal(false);
      setSelectedUser(null);
      setCurp("");
    } catch (err) {
      setConversionError(err instanceof Error ? err.message : "Error al convertir usuario");
    } finally {
      setConverting(false);
    }
  };

  const getFullName = (user: ExternalUser) => {
    const parts = [
      user.name,
      user.parent_last_name,
      user.maternal_last_name,
    ].filter(Boolean);
    return parts.join(" ");
  };

  const filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase();
    const username = user.username.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || username.includes(search);
  });

  const isDoctor = currentUser?.role_id === ROLE_IDS.DOCTOR;

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Cargando usuarios externos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={loadExternalUsers}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Usuarios Externos
          </h1>
          <p className="text-gray-600">
            Usuarios registrados sin rol específico (sin registro de paciente, doctor, laboratorista o familiar)
          </p>
          {!isDoctor && (
            <p className="text-amber-600 text-sm mt-2">
              ⚠️ Solo los doctores pueden convertir usuarios externos a pacientes
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">
              {searchTerm
                ? "No se encontraron usuarios"
                : "No hay usuarios externos registrados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                      <FaUser className="text-gray-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getFullName(user)}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Usuario:</span>
                      <span>{user.username}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Teléfono:</span>
                      <span>{user.phone_number}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Rol actual:</span>
                      <span className="text-amber-600 font-medium">{user.role_name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Registro:</span>
                      <span className="text-xs">
                        {new Date(user.registration_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isDoctor && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleConvertClick(user)}
                        className="flex items-center justify-center w-full text-green-600 hover:text-green-800 font-medium py-2 px-4 border border-green-600 rounded hover:bg-green-50 transition-colors"
                      >
                        <FaUserPlus className="mr-2" />
                        Convertir a Paciente
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Mostrando {filteredUsers.length} de {users.length} usuarios externos
          </div>
        )}
      </div>

      {/* Conversion Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Convertir a Paciente
              </h2>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Usuario:</span> {getFullName(selectedUser)}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Username:</span> {selectedUser.username}
                </p>
              </div>

              <form onSubmit={handleConvertSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CURP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    placeholder="ABCD123456HDFXYZ01"
                    maxLength={18}
                    required
                    disabled={converting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clave Única de Registro de Población (18 caracteres)
                  </p>
                </div>

                {conversionError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                    {conversionError}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUser(null);
                      setCurp("");
                      setConversionError(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={converting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={converting}
                  >
                    {converting ? "Convirtiendo..." : "Convertir"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExternalUsersListPage;
