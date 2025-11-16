import Hero from "../molecules/hero";
import Services from "../molecules/services";
import Card from "../molecules/card";
import LandingNavbar from "../organism/landing.navbar";

const LandingPage = () => {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <Services />
      <Card title="Servicios destacados">
        <p>Contenido de la tarjeta</p>
        </Card>

    </>
  );
};

export default LandingPage;