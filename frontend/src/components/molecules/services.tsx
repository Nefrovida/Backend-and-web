import Card from "../molecules/card";
import Title from "../atoms/Title";

export default function Services() {
  return (
    <section id="services" className="container-padded py-16">
      <Title>Nuestros Servicios</Title>
      <p className="mt-4 text-gray-700">
        Ofrecemos servicios especializados en la detección, prevención y tratamiento de la Enfermedad Renal Crónica.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Card title="Tamizaje ERC">
          <ul className="space-y-2 text-gray-700">
            <li>Niños (donativo $180)</li>
            <li>Adultos (donativo $200)</li>
            <li>Embarazadas (donativo $395)</li>
          </ul>
        </Card>
        <Card title="Consultas">
          <ul className="space-y-2 text-gray-700">
            <li>Nefrología</li>
            <li>Urología</li>
            <li>Nutrición</li>
            <li>Psicología</li>
          </ul>
        </Card>
        <Card title="Ultrasonidos">
          <ul className="space-y-2 text-gray-700">
            <li>Renal</li>
            <li>Abdomen</li>
            <li>Próstata</li>
            <li>Tiroides</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}