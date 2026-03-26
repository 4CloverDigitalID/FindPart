import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  // Scroll-hide + frosted effect
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 20)
      setVisible(currentY < lastScrollY.current || currentY < 60)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
  { label: 'About',   href: 'about'   },
  { label: 'FaQ',     href: 'faq'     },
  { label: 'Mission', href: 'mission' },
  { label: 'Contact', href: 'contact' },
]

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  setMenuOpen(false)
}

  return (
    <>
      <style>{`
        .navbar-wrapper {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      background 0.3s ease,
                      backdrop-filter 0.3s ease,
                      box-shadow 0.3s ease;
        }
        .navbar-wrapper.hidden-nav {
          transform: translateY(-100%);
        }
        .navbar-wrapper.scrolled {
          background: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(14px);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .nav-link {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 2px;
          background: #facc15;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #facc15; transition: color 0.2s ease; }

        .btn-masuk {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .btn-masuk:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.4);
        }
        .btn-daftar {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .btn-daftar:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255,255,255,0.15);
          background: #fff;
        }

        .bar {
          display: block;
          height: 2px;
          width: 24px;
          background: white;
          border-radius: 2px;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.25s ease,
                      width 0.3s ease;
          transform-origin: center;
        }
        .bar-top.open    { transform: rotate(45deg) translate(5px, 5px); }
        .bar-mid.open    { opacity: 0; width: 0; }
        .bar-bot.open    { transform: rotate(-45deg) translate(5px, -5px); }

        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
        }
        .mobile-menu.open {
          max-height: 400px;
          opacity: 1;
        }

        .mobile-link {
          opacity: 0;
          transform: translateX(-12px);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.2s ease;
        }
        .mobile-menu.open .mobile-link { opacity: 1; transform: translateX(0); }
        .mobile-menu.open .mobile-link:nth-child(1) { transition-delay: 0.05s; }
        .mobile-menu.open .mobile-link:nth-child(2) { transition-delay: 0.10s; }
        .mobile-menu.open .mobile-link:nth-child(3) { transition-delay: 0.15s; }
        .mobile-menu.open .mobile-link:nth-child(4) { transition-delay: 0.20s; }
        .mobile-link:hover { color: #facc15; }

        .mobile-btn {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .mobile-menu.open .mobile-btn { opacity: 1; transform: translateY(0); }
        .mobile-menu.open .mobile-btn:nth-child(1) { transition-delay: 0.25s; }
        .mobile-menu.open .mobile-btn:nth-child(2) { transition-delay: 0.32s; }

        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .logo-anim { animation: logoFadeIn 0.5s ease forwards; }

        @keyframes linksFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .links-anim { animation: linksFadeIn 0.5s ease 0.15s both; }
        .btns-anim  { animation: linksFadeIn 0.5s ease 0.25s both; }
      `}</style>

      <nav className={`navbar-wrapper w-full fixed bg-black text-white z-50 ${!visible ? 'hidden-nav' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

          <div className="logo-anim flex items-center gap-3">
            <img className='w-17 h-15' src="image/Icon.png" alt="FindPart Logo" />
            <span style={{ fontFamily: "Poppins" }} className="font-semibold text-xl">FindPart</span>
          </div>

          <ul style={{ fontFamily: "inter" }} className="links-anim hidden md:flex gap-8 text-lg">
            {navLinks.map(link => (
              <li
                key={link.label}
                className="nav-link cursor-pointer"
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </li>
            ))}
          </ul>

          <div style={{ fontFamily: "inter" }} className="btns-anim hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-masuk bg-yellow-400 text-black px-10 py-2 rounded-xl inline-block">
              Masuk
            </Link>
            <Link to="/register" className="btn-daftar bg-gray-200 text-black px-10 py-2 rounded-xl inline-block">
              Daftar
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`bar bar-top ${menuOpen ? 'open' : ''}`} />
            <span className={`bar bar-mid ${menuOpen ? 'open' : ''}`} />
            <span className={`bar bar-bot ${menuOpen ? 'open' : ''}`} />
          </button>

        </div>

        <div className={`mobile-menu md:hidden bg-black px-6 pb-3 ${menuOpen ? 'open' : ''}`}>
          <div className="w-full h-px bg-white/10 mb-5" />

          <ul style={{ fontFamily: "inter" }} className="flex flex-col gap-4 text-lg mb-5">
            {navLinks.map(link => (
              <li
                key={link.label}
                className="mobile-link cursor-pointer"
                onClick={() => scrollToSection(link.href)}
              >
                {link.label}
              </li>
            ))}
          </ul>

          <div style={{ fontFamily: "inter" }} className="flex flex-col gap-3">
            <Link to="/login"
              className="mobile-btn btn-masuk bg-yellow-400 text-black px-10 py-2 rounded-xl text-center block"
              onClick={() => setMenuOpen(false)}>
              Masuk
            </Link>
            <Link to="/register"
              className="mobile-btn btn-daftar bg-gray-200 text-black px-10 py-2 rounded-xl text-center block"
              onClick={() => setMenuOpen(false)}>
              Daftar
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar