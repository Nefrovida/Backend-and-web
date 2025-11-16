import NavLink from "../molecules/nav.link";

export default function Navbar() {
  const items = ["Nosotros","Laboratorio","ERC","Transparencia","Contacto"];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="container-padded flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary" aria-hidden />
          <span className="text-lg font-bold text-primary">NefroVida A.C.</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {items.map(item => <NavLink key={item} label={item} />)}
        </nav>
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm text-gray-700">Contáctanos: (01 427)101·34·35</span>
          <span className="text-xs text-gray-500">San Juan del Río, Querétaro, México.</span>
        </div>
      </div>
    </header>
  );
}