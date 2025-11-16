export default function NavLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-gray-700 hover:text-primary transition-colors">
      {label}
    </a>
  );
}