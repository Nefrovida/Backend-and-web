type Props = {
  label: string;
  type?: string;
  placeholder?: string;
};

export default function Input({ label, type = "text", placeholder }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
      />
    </div>
  );
}