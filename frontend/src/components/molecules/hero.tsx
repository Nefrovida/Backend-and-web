import Button from "../atoms/button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary via-light-blue to-success text-white py-20">
      <div className="container-padded text-center">
        <h1 className="text-5xl font-bold">Cuidamos tu salud renal</h1>
        <p className="mt-4 text-lg">NefroVida A.C. — Comprometidos con la salud desde 2007</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="primary">Conoce nuestros servicios</Button>
          <Button variant="success">Agendar cita</Button>
        </div>
      </div>
    </section>
  );
}