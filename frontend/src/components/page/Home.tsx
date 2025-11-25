// src/components/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import { authService } from "../../services/auth.service";

const Home: React.FC = () => {
  const user = authService.getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <div className="landing-text min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-left">
              <h1 className="text-2xl font-bold leading-none tracking-tight">
                <span className="text-blue-900">NEFR</span>
                <span className="text-red-600">O</span>
                <span className="text-lime-500">Vida</span>
              </h1>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Asociación Civil - Salud renal integral
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
            <span>San Juan del Río, Querétaro</span>
            <span className="border-l h-4 border-slate-300" />
            <span>
              Contáctanos:{" "}
              <span className="font-medium text-slate-900">(01 427) 101-34-35</span>
            </span>
          </div>

          {/* Quick CTA in header (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                    Iniciar sesión
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2 rounded-full text-sm font-semibold border border-blue-900 text-blue-900 bg-white hover:bg-blue-50 transition-colors">
                    Registrarse
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <button className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                  Ir a dashboard
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-slate-50">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              {/* Left column: text + CTA */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  <span className="text-blue-900">NEFR</span>
                  <span className="text-red-600">O</span>
                  <span className="text-lime-500">Vida</span>
                </h1>

                <p className="mt-4 text-base md:text-lg text-slate-700 max-w-xl">
                  En NefroVida A.C. estamos comprometidos con la salud de nuestros pacientes.
                  Ofrecemos servicios especializados en la detección, prevención y tratamiento
                  de la Enfermedad Renal Crónica, diseñados para proteger tu salud renal y mejorar
                  tu calidad de vida.
                </p>

              </div>

              {/* Right column: info cards of services */}
              <div className="space-y-4">
                <div className="rounded-3xl bg-white shadow-sm border border-slate-100 p-5 md:p-6">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Nuestros servicios principales
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Todos nuestros servicios están diseñados para cuidar la salud renal
                    y acompañar a pacientes y familias en cada etapa.
                  </p>

                  <div className="mt-4 grid gap-3 text-xs text-slate-700">
                    <div className="border border-slate-100 rounded-2xl p-3">
                      <p className="font-medium text-slate-900">
                        Tamizaje de detección y prevención de ERC
                      </p>
                      <p className="mt-1">
                        Niños (donativo $180), adultos (donativo $200), embarazadas
                        (donativo $395).
                      </p>
                      <p className="mt-1 text-slate-500 text-[11px]">
                        Incluye estudios de laboratorio, cuestionario de riesgo,
                        toma de presión arterial, peso, talla, circunferencia de
                        cintura, entrega de estudios impresos, interpretación,
                        recomendación y derivación con especialidades.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-3">
                      <p className="font-medium text-slate-900">Consultas</p>
                      <p className="mt-1">
                        Nefrología, nefro pediatría, urología, diabetólogo,
                        médico general, nutrición y psicología.
                      </p>
                      <p className="mt-1 text-slate-500 text-[11px]">
                        Llama, pregunta por nuestras cuotas de recuperación y agenda.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-3">
                      <p className="font-medium text-slate-900">Ultrasonidos</p>
                      <p className="mt-1">
                        Renal, abdomen, próstata, tiroides, obstétrico, tejidos
                        blandos, hernias, testicular, mama y más.
                      </p>
                      <p className="mt-1 text-slate-500 text-[11px]">
                        Realizados por un médico certificado.
                      </p>
                    </div>
                  </div>
                </div>
{/* 
                <div className="rounded-3xl bg-blue-900 text-white p-5 md:p-6 text-sm">
                  <p className="font-semibold">Tu donativo transforma vidas</p>
                  <p className="mt-2 text-xs md:text-sm text-blue-50">
                    Además con tu donativo ayudas a pacientes en tratamiento
                    sustitutivo con el pago de sesiones de hemodiálisis y a
                    continuar realizando prevención de Enfermedad Renal a
                    personas en situación vulnerable.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* About NefroVida
        <section className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                NefroVida A.C.
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Desde el año 2007, médicos, psicólogos, tanatólogos, nutriólogos
                y especialistas en el cuidado de la salud física y emocional
                conforman un equipo interdisciplinario para apoyar a pacientes
                con Insuficiencia Renal Crónica en situación de pobreza y
                vulnerabilidad en el estado de Querétaro y comunidades aledañas.
              </p>
              <p className="mt-3 text-base text-slate-600">
                Atendemos principalmente a personas sin seguridad social que se
                encuentran en diálisis peritoneal, hemodiálisis o en protocolo
                de trasplante, con un enfoque integral en su bienestar.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-medium text-slate-900">
                  Estudios de laboratorio
                </p>
                <p className="mt-2 text-xs">
                  Realizamos cualquier tipo de estudio de laboratorio con cuotas
                  bajas de recuperación. Los exámenes son una herramienta
                  primordial para diagnosticar diferentes patologías, definir
                  tratamientos y dar seguimiento a la evolución de cada paciente.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-medium text-slate-900">
                  Acompañamiento integral
                </p>
                <p className="mt-2 text-xs">
                  Nuestro equipo interdisciplinario brinda apoyo médico,
                  nutricional, psicológico y tanatológico, poniendo en el centro
                  la calidad de vida de las personas y sus familias.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Mission, Vision and Values */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Conoce más sobre NefroVida A.C.
                </h2>
                {/* <p className="mt-2 text-sm text-slate-600 max-w-xl">
                  Nuestra labor está guiada por principios humanos, atención interdisciplinaria
                  y un compromiso con la prevención, detección y tratamiento de la Enfermedad Renal Crónica
                  en personas en situación vulnerable.
                </p> */}
              </div>

              <a
                href="https://www.nefrovidaac.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-900 underline underline-offset-4"
              >
                Consulta más información
              </a>
            </div>

            {/* Mission / Vision / Values cards */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Mission */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-900">Misión</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Brindar atención y apoyo multidisciplinario para la prevención, detección, control
                  y tratamiento de la Enfermedad Renal Crónica. Acompañamos a personas con o sin tratamiento
                  sustitutivo (hemodiálisis, diálisis) y en protocolos de trasplante mediante programas
                  que mejoren su calidad de vida.
                </p>
              </div>

              {/* Vision */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-900">Visión</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Ser una organización autosustentable que promueve la detección oportuna y la prevención
                  en personas en situación vulnerable con factores de riesgo para ERC, contribuyendo
                  a disminuir su progresión y su letalidad.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="contacto"
        className="border-t border-slate-200 bg-white text-xs text-slate-600"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-900">Contacto</p>
            <p className="mt-1">San Juan del Río, Querétaro, México.</p>
            <p className="mt-1">
              Teléfono: <span className="font-medium">(01 427) 101-34-35</span>
            </p>
            <p className="mt-1">
              Beneficiarios: lunes a viernes, 09:00 a 17:00 h
            </p>
            <p className="mt-1">Laboratorio: lunes a viernes, 07:30 a 17:00 h</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Redes sociales</p>
            <ul className="mt-1 space-y-1">
              <li>
                <a
                  href="https://www.facebook.com/NefroVida.ac"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-900"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/nefrovida.ac/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-900"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UC9sKS22h-ju-qg1Fm1OMYew"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-900"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <p className="text-slate-500">
              © {new Date().getFullYear()} NefroVida A.C. Todos los derechos reservados.
            </p>
            <p className="text-slate-400">
              Creado porVitalsoft.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;