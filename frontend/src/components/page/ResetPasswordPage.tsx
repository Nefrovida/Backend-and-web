import React, { useState, useEffect } from "react";
import { usersService } from "../../services/users.service";
import { FaSearch, FaKey } from "react-icons/fa";

interface User {
    user_id: string;
    username: string;
    name: string;
    role: {
        role_name: string;
    };
}

const ResetPasswordPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");
    const [resetError, setResetError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.username.toLowerCase().includes(lowerTerm) ||
                user.name.toLowerCase().includes(lowerTerm)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getUsers(true);
            setUsers(data);
            setFilteredUsers(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleResetClick = (user: User) => {
        setSelectedUser(user);
        setNewPassword("");
        setResetMessage("");
        setResetError("");
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setResetLoading(true);
        setResetMessage("");
        setResetError("");

        try {
            await usersService.resetPassword(selectedUser.user_id, newPassword);
            setResetMessage("Contraseña restablecida correctamente");
            setTimeout(() => {
                setSelectedUser(null);
            }, 2000);
        } catch (err: any) {
            setResetError(err.message || "Error al restablecer contraseña");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Restablecer Contraseñas
                </h1>
                <p className="text-gray-600">
                    Busca un usuario y asigna una nueva contraseña.
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                    placeholder="Buscar por nombre o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users List */}
            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.user_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {user.role.role_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleResetClick(user)}
                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-2 ml-auto"
                                        >
                                            <FaKey size={12} />
                                            Restablecer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron usuarios.
                        </div>
                    )}
                </div>
            )}

            {/* Reset Password Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            Restablecer Contraseña
                        </h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Ingresa la nueva contraseña para <strong>{selectedUser.username}</strong>.
                        </p>

                        <form onSubmit={handleResetSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2 ml-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 transition-colors"
                                    placeholder="Escribe la nueva contraseña"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {resetMessage && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                    {resetMessage}
                                </div>
                            )}

                            {resetError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {resetError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                            >
                                {resetLoading ? "Guardando..." : "Guardar Nueva Contraseña"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;
