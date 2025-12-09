// src/components/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import { authService } from "../../services/auth.service";
import nefrovidaLogo from "@/assets/logo.png";

const Home: React.FC = () => {
  const user = authService.getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <div className="landing-text min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="#"
              className="flex items-center"
              onClick={(e) => e.preventDefault()}
            >
              <img
                src={nefrovidaLogo}
                alt="NefroVida A.C."
                className="h-12 md:h-14 w-auto select-none pointer-events-none"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
            <span>San Juan del Río, Querétaro</span>
            <span className="border-l h-4 border-slate-300" />
            <span>
              Contáctanos:{" "}
              <span className="font-medium text-slate-900">427 101 34 35</span>
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

        {/* Compact header for mobile: location + phone + CTA */}
        <div className="md:hidden border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 text-[11px] text-slate-700">
            <div className="flex flex-col">
              <span className="font-medium">
                San Juan del Río, Querétaro
              </span>
              <span>
                Contáctanos:{" "}
                <span className="font-semibold">427 101 34 35</span>
              </span>
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="flex-1">
                    <button className="w-full px-4 py-2 rounded-full text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <button className="w-full px-4 py-2 rounded-full text-xs font-semibold border border-blue-900 text-blue-900 bg-white hover:bg-blue-50 transition-colors">
                      Registrarse
                    </button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="flex-1">
                  <button className="w-full px-4 py-2 rounded-full text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                    Ir a dashboard
                  </button>
                </Link>
              )}
            </div>
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
                  Cuidado íntegro de la salud renal
                </h1>

                <p className="mt-4 text-base md:text-lg text-slate-700 max-w-xl">
                  NefroVida A.C. es una asociación sin fines de lucro cuyo principal objetivo 
                  es apoyar a pacientes y familiares con Enfermedad Renal Crónica, en situación 
                  de vulnerabilidad, y residentes de San Juan del Río y municipios aledaños.
                </p>

                <p className="mt-3 text-base md:text-lg text-slate-700 max-w-xl">
                  Estamos comprometidos con la salud de nuestros pacientes. Ofrecemos servicios 
                  especializados en la detección, prevención y tratamiento de la Enfermedad Renal 
                  Crónica, diseñados para proteger tu salud renal y mejorar tu calidad de vida.
                </p>

                <p className="mt-3 text-base md:text-lg text-slate-700 max-w-xl">
                  Además, con tu donativo ayudas a pacientes en tratamiento sustitutivo con el 
                  pago de sesiones de hemodiálisis y a continuar realizando prevención de 
                  Enfermedad Renal a personas en situación vulnerable.
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
                        Nuestros Tamizajes
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        OBJETIVO: Detectar de manera temprana alteraciones en la función renal 
                        para prevenir o retrasar la progresión de enfermedades renales crónicas.
                      </p>
                      <p className="mt-2 text-slate-600">
                        INCLUYE: Aplicación de cuestionario de factor de riesgo, toma de presión arterial, 
                        peso, talla, circunferencia de cintura, estudios de laboratorio de sangre y orina, 
                        entrega de estudios impresos, interpretación, recomendaciones y derivación con especialidades.
                      </p>
                      <div className="mt-2 space-y-1">
                        <p>• <span className="font-medium">NIÑOS:</span> Química Sanguínea de 6 elementos + examen general de orina</p>
                        <p>• <span className="font-medium">ADULTOS:</span> Química Sanguínea de 6 elementos + microalbuminuria</p>
                        <p>• <span className="font-medium">EMBARAZADAS:</span> Química Sanguínea de 6 elementos + PFH + BH + examen general de orina</p>
                      </div>
                      <p className="mt-2 text-slate-500 text-[11px]">
                        Llama, pregunta por nuestras cuotas de recuperación y agenda.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-3">
                      <p className="font-medium text-slate-900">Consultas</p>
                      <p className="mt-1 text-slate-600">
                        Atención médica especializada:
                      </p>
                      <div className="mt-1 space-y-0.5">
                        <p>• Nefrología</p>
                        <p>• Nefro pediatra</p>
                        <p>• Urología</p>
                        <p>• Diabetólogo</p>
                        <p>• Médico General</p>
                        <p>• Nutrición</p>
                        <p>• Psicología</p>
                      </div>
                      <p className="mt-2 text-slate-500 text-[11px]">
                        Llama, pregunta por nuestras cuotas de recuperación y agenda.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-3">
                      <p className="font-medium text-slate-900">Ultrasonidos</p>
                      <p className="mt-1">
                        Realizados por un médico certificado, con previa cita:
                      </p>
                      <div className="mt-1 space-y-0.5">
                        <p>• Renal</p>
                        <p>• Abdomen</p>
                        <p>• Entre otros más</p>
                      </div>
                      <p className="mt-2 text-slate-500 text-[11px]">
                        Llama, pregunta por nuestras cuotas de recuperación y agenda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision and Values */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  Conoce más sobre NefroVida A.C.
                </h2>
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
                  Brindar atención y apoyo multidisciplinario en la prevención, detección, control 
                  y tratamiento de personas con Enfermedad Renal Crónica, con o sin tratamiento 
                  sustitutivo de función renal (hemodiálisis, diálisis) y acompañamiento de protocolo 
                  de trasplante por medio de programas y acciones que contribuyan a mejorar su calidad de vida.
                </p>
              </div>

              {/* Vision */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-900">Visión</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Ser una organización autosustentable que promueve la prevención y detección oportuna 
                  en personas con factores de riesgo de la Enfermedad Renal Crónica (ERC), que se encuentran 
                  en situación vulnerable; con el fin de modificar positivamente la evolución natural y así 
                  disminuir la letalidad de la ERC.
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
            <p className="mt-1">
              <span className="font-medium">Dirección:</span><br />
              Sierra Vertientes #167 Lomas de San Juan<br />
              San Juan del Río, Querétaro, México
            </p>
            <p className="mt-2">
              <span className="font-medium">Teléfono:</span> 427 101 34 35
            </p>
            <p className="mt-1">
              <span className="font-medium">WhatsApp:</span> 427 219 1068
            </p>
            <p className="mt-1">
              <span className="font-medium">Correo:</span> nefrovida.a.c@hotmail.com
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Horario</p>
            <p className="mt-1">
              <span className="font-medium">Beneficiarios:</span><br />
              Lunes - Viernes: 7:30am – 3:30pm
            </p>
            <p className="mt-2">
              <span className="font-medium">Laboratorio:</span><br />
              Lunes - Viernes: 7:30am – 9:00am
            </p>
            
            <p className="font-semibold text-slate-900 mt-4">Redes sociales</p>
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
            <p className="text-slate-400 mt-1">
              Creado por Vitalsoft.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;