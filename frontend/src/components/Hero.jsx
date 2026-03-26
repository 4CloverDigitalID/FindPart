import React from 'react'
import { Link } from 'react-router-dom'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const Hero = () => {
  return (
    <>
      <style>{`
        .hero-overlay {
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.15) 50%,
            rgba(0,0,0,0.5) 100%
          );
        }

        @keyframes heroTitleIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes heroBtnIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes kenBurns {
          from { transform: scale(1); }
          to   { transform: scale(1.08); }
        }

        .hero-img {
          animation: kenBurns 10s ease-out forwards;
        }

        .hero-title {
          animation: heroTitleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
          text-shadow: 0 4px 24px rgba(0,0,0,0.5);
        }

        .hero-btn-wrap {
          animation: heroBtnIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
        }

        .hero-btn {
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.2s ease;
          box-shadow: 0 4px 20px rgba(250, 204, 21, 0.35);
        }
        .hero-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 32px rgba(250, 204, 21, 0.55);
          background: #eab308;
        }
        .hero-btn:active {
          transform: translateY(0) scale(0.98);
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50%       { transform: translateY(8px); opacity: 1; }
        }
        .scroll-indicator {
          animation: scrollBounce 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="h-screen relative overflow-hidden">

        <img
          className="hero-img w-full h-full object-cover absolute inset-0"
          src="image/Hero-img.png"
          alt="FindPart Hero"
        />

        <div className="hero-overlay absolute inset-0" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <h1
            style={{ fontFamily: "Poppins" }}
            className="hero-title text-white font-semibold mb-6
                       text-5xl
                       sm:text-6xl
                       md:text-7xl
                       lg:text-8xl"
          >
            FindPart
          </h1>

          <div className="hero-btn-wrap">
            <Link
              to="/register"
              style={{ fontFamily: "inter" }}
              className="hero-btn bg-yellow-400 text-black font-semibold rounded-xl cursor-pointer inline-block
                         px-8 py-2.5 text-base
                         sm:px-10 sm:py-3 sm:text-lg
                         md:px-12 md:py-3 md:text-xl"
            >
              Gabung Sekarang
            </Link>
          </div>

        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span style={{ fontFamily: "inter" }} className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 0v16M1 9l7 7 7-7" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

      </div>
    </>
  )
}

export default Hero