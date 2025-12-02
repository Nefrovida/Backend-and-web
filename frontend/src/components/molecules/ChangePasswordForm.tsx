import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import { ChangePasswordDTO } from '@/types/profile.types';

type Props = {
  onChangePassword: (payload: ChangePasswordDTO) => Promise<void>;
};

const ChangePasswordForm: React.FC<Props> = ({ onChangePassword }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onChangePassword(form);
    } catch (err: any) {
      setError(err?.message || 'Error');
      throw err;
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600">Contraseña actual</label>
        <input type="password" className="w-full p-2 border rounded mt-1" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Nueva contraseña</label>
        <input type="password" className="w-full p-2 border rounded mt-1" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Confirmar nueva contraseña</label>
        <input type="password" className="w-full p-2 border rounded mt-1" value={form.confirmNewPassword} onChange={e => setForm({...form, confirmNewPassword: e.target.value})} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end">
        <Button onClick={undefined} className="px-6">
          <button type="submit" className="w-full">{saving ? 'Guardando...' : 'Cambiar contraseña'}</button>
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
