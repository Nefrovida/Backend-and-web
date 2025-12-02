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
          <h3 className="text-xl font-semibold mb-4">Mis datos</h3>
          <ProfileForm initial={user} onSave={onSave} />
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
