
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import heroQuinces from "../assets/vid/hero-quinces.mp4";
import heroQuincesPoster from "../assets/img/dark-blue-texture.jpg";

const quincesLogo = "/img/quinces-logo.webp";
const invitationCover = "/img/invitation-cover.webp";
const invitationOpening = "/vid/invitation-opening.mp4";

// DATOS EDITABLES DE LA INVITACIÓN
const quinceaneraName = "Sofi";
const eventDate = "11 · 12 · 2026";

export function Intro({ onEnvelopeOpen }) {
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const introVideo = useRef(null);
  const wasVideoPlayingBeforeHidden = useRef(false);

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", !invitationOpen);
    return () => document.body.classList.remove("invitation-locked");
  }, [invitationOpen]);

  useEffect(() => {
    if (!envelopeOpening) return undefined;
    const timeoutId = setTimeout(() => setInvitationOpen(true), 5000);
    return () => clearTimeout(timeoutId);
  }, [envelopeOpening]);

  useEffect(() => {
    if (invitationOpen) return undefined;

    const handleVisibilityChange = async () => {
      const video = introVideo.current;
      if (!video) return;

      if (document.hidden) {
        wasVideoPlayingBeforeHidden.current = !video.paused;
        if (!video.paused) video.pause();
      } else if (wasVideoPlayingBeforeHidden.current) {
        try {
          await video.play();
        } catch {
          // El invitado puede volver a tocar la invitación.
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [invitationOpen]);

  function openInvitation() {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);
    onEnvelopeOpen();
    introVideo.current?.play().catch(() => {});
  }

  function trackIntroProgress() {
    const video = introVideo.current;
    if (!video) return;
    if (video.currentTime > 0.05) setIntroVisible(true);
    if (video.duration - video.currentTime <= 0.8 && !invitationOpen) {
      setInvitationOpen(true);
    }
  }

  function handleIntroError() {
    setInvitationOpen(true);
  }

  return (
    <>
      <section
        className={`invitation-cover ${envelopeOpening ? "is-opening" : ""} ${invitationOpen ? "is-open" : ""}`}
        aria-hidden={invitationOpen}
        aria-label="Abrir invitación"
        role="button"
        tabIndex={invitationOpen ? -1 : 0}
        onClick={openInvitation}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
          }
        }}
      >
        <img
          className={`intro-media intro-poster ${introVisible ? "hidden" : ""}`}
          src={invitationCover}
          alt=""
        />

        <video
          className={`intro-media intro-video ${introVisible ? "visible" : ""}`}
          ref={introVideo}
          src={invitationOpening}
          poster={invitationCover}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onTimeUpdate={trackIntroProgress}
          onEnded={() => setInvitationOpen(true)}
          onError={handleIntroError}
        />

        {!envelopeOpening && (
          <p className="intro-hint">TOCÁ PARA ABRIR TU INVITACIÓN</p>
        )}
      </section>

      <header className="hero" id="inicio">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          poster={heroQuincesPoster}
        >
          <source src={heroQuinces} type="video/mp4" />
        </video>

        <nav className="navbar">
          <a className="brand" href="#inicio">
            <img
              src={quincesLogo}
              width={44}
              height={44}
              alt="Volver al inicio"
            />
          </a>

          <div className="nav-links">
            <a href="#detalles">La celebración</a>
            <a href="#contacto">Contacto</a>
            <a href="#confirmar">Confirmar asistencia</a>
          </div>
        </nav>

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-kicker">UNA NOCHE MÁGICA</p>

          <h1>
            <em className="quinceanera-title">
              <span>{quinceaneraName}</span>
            </em>
          </h1>

          <p className="hero-subtitle">MIS QUINCE AÑOS</p>
          <p className="hero-date">{eventDate}</p>

          <a className="outline-button" href="#bienvenida">
            DESCUBRÍ LOS DETALLES
          </a>
        </div>

        <a className="scroll-hint" href="#bienvenida" aria-label="Continuar">
          <b><ChevronDown aria-hidden="true" /></b>
        </a>
      </header>
    </>
  );
}

        </a>
      </header>
    </>
  );
}
