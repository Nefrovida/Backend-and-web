import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import { UpdateProfileDTO, UserProfileDTO } from '@/types/profile.types';

type Props = {
  initial: UserProfileDTO;
  onSave: (payload: UpdateProfileDTO) => Promise<void>;
};

const ProfileForm: React.FC<Props> = ({ initial, onSave }) => {
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
        <input className="w-full p-2 border rounded mt-1" value={form.name ?? ''} onChange={e => change('name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Apellido Paterno</label>
          <input className="w-full p-2 border rounded mt-1" value={form.parent_last_name ?? ''} onChange={e => change('parent_last_name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Apellido Materno</label>
          <input className="w-full p-2 border rounded mt-1" value={form.maternal_last_name ?? ''} onChange={e => change('maternal_last_name', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600">Teléfono</label>
        <input className="w-full p-2 border rounded mt-1" value={form.phone_number ?? ''} onChange={e => change('phone_number', e.target.value)} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end">
        <Button onClick={undefined} className="px-6">
          <button type="submit" className="w-full">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
