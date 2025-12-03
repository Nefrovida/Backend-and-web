import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import { ChangePasswordDTO } from '@/types/profile.types';

type Props = {
  onChangePassword: (payload: ChangePasswordDTO) => Promise<void>;
  onCancel?: () => void;
};

const ChangePasswordForm: React.FC<Props> = ({ onChangePassword, onCancel }) => {
  const [form, setForm] = useState({ newPassword: '', confirmNewPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // client-side max length enforcement
    if (form.newPassword.length > 15) {
      setError('La contraseña no puede tener más de 15 caracteres');
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

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
        <label className="block text-sm text-gray-600">Nueva contraseña</label>
        <input type="password" maxLength={15} className="w-full p-2 border rounded mt-1" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Confirmar nueva contraseña</label>
        <input type="password" maxLength={15} className="w-full p-2 border rounded mt-1" value={form.confirmNewPassword} onChange={e => setForm({...form, confirmNewPassword: e.target.value})} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end items-center gap-3">
        <Button onClick={() => onCancel && onCancel()} variant="danger" className="px-4 py-2 text-sm rounded-full">Cancelar</Button>
        <Button type="submit" variant="primary" className="px-6 py-2 text-sm rounded-full">{saving ? 'Guardando...' : 'Cambiar contraseña'}</Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
