    import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import { UpdateProfileDTO, UserProfileDTO } from '@/types/profile.types';

type Props = {
  initial: UserProfileDTO;
  onSave: (payload: UpdateProfileDTO) => Promise<void>;
  onCancel?: () => void;
};

const ProfileForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState<UpdateProfileDTO>({
    name: initial.name,
    parent_last_name: initial.parent_last_name,
    maternal_last_name: initial.maternal_last_name,
    phone_number: initial.phone_number,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = (k: keyof UpdateProfileDTO, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate phone length if provided
    const phone = form.phone_number ?? '';
    if (phone) {
      // allow only digits and length between 10 and 15
      if (!/^\d{10,15}$/.test(phone)) {
        setError('El número de teléfono debe contener sólo dígitos y tener entre 10 y 15 caracteres');
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err?.message || 'Error');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600">Nombre(s)</label>
        <input maxLength={50} className="w-full p-2 border rounded mt-1" value={form.name ?? ''} onChange={e => change('name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Apellido Paterno</label>
          <input maxLength={50} className="w-full p-2 border rounded mt-1" value={form.parent_last_name ?? ''} onChange={e => change('parent_last_name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Apellido Materno</label>
          <input maxLength={50} className="w-full p-2 border rounded mt-1" value={form.maternal_last_name ?? ''} onChange={e => change('maternal_last_name', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600">Teléfono</label>
        <input
          type="tel"
          minLength={10}
          maxLength={15}
          pattern="\d{10,15}"
          className="w-full p-2 border rounded mt-1"
          value={form.phone_number ?? ''}
          onChange={e => change('phone_number', e.target.value)}
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end items-center gap-3">
        <Button onClick={() => onCancel && onCancel()} variant="danger" className="px-4 py-2 text-sm rounded-full">Cancelar</Button>
        <Button type="submit" variant="primary" className="px-6 py-2 text-sm rounded-full">{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
      </div>
    </form>
  );
};

export default ProfileForm;
