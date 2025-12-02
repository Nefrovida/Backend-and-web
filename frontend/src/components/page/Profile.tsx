import React, { useEffect, useState, useRef } from 'react';
import PageHeader from '@/components/molecules/PageHeader';
import ProfileForm from '@/components/molecules/ProfileForm';
import ChangePasswordForm from '@/components/molecules/ChangePasswordForm';
import profileService from '@/services/profile.service';
import { UserProfileDTO, UpdateProfileDTO, ChangePasswordDTO } from '@/types/profile.types';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await profileService.getMyProfile();
        // backend often returns { message, data } or data directly
        const payload = data?.data ?? data;
        setUser(payload);
      } catch (err: any) {
        setError(err?.message || 'Error al cargar perfil');
      } finally { setLoading(false); }
    })();
  }, []);

  // Animate and scroll into view when user data is loaded
  useEffect(() => {
    if (!loading && user) {
      // small delay to ensure layout is ready
      requestAnimationFrame(() => {
        setMounted(true);
        setTimeout(() => {
          if (focusRef.current) {
            try {
              focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (e) {
              // ignore
            }
          }
        }, 120);
      });
    }
  }, [loading, user]);

  const onSave = async (payload: UpdateProfileDTO) => {
    const res = await profileService.updateMyProfile(payload);
    const updated = res?.data ?? res;
    setUser(updated);
    setEditing(false);
  };

  const onChangePassword = async (payload: ChangePasswordDTO) => {
    await profileService.changePassword(payload);
    // navigate back to dashboard after change
    navigate('/dashboard');
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>No autenticado</div>;

  return (
    <div ref={containerRef} className="space-y-6 p-6">
      <PageHeader title="Mi Perfil" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          ref={focusRef}
          className={`bg-white p-6 rounded shadow transform transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold mb-4">Mis datos</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:underline">Editar</button>
            ) : (
              <button onClick={() => setEditing(false)} className="text-sm text-gray-600 hover:underline">Cancelar</button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Nombre(s)</div>
                <div className="text-lg font-medium">{user.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Apellido Paterno</div>
                  <div className="text-lg font-medium">{user.parent_last_name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Apellido Materno</div>
                  <div className="text-lg font-medium">{user.maternal_last_name}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Teléfono</div>
                <div className="text-lg font-medium">{user.phone_number}</div>
              </div>
            </div>
          ) : (
            <ProfileForm initial={user} onSave={onSave} />
          )}
        </div>

        <div className={`bg-white p-6 rounded shadow transform transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-xl font-semibold mb-4">Contraseña</h3>
          <ChangePasswordForm onChangePassword={onChangePassword} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
