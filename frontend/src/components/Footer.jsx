import React, { useEffect, useRef, useState } from "react";
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebookF } from "react-icons/fa";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

const socialIcons = [
  {
    icon: <FaInstagram size={23} />,
    label: "Instagram",
    hover: "group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-yellow-400 group-hover:text-white",
  },
  {
    icon: <FaWhatsapp size={23} />,
    label: "WhatsApp",
    hover: "group-hover:bg-green-500 group-hover:text-white",
  },
  {
    icon: <FaTwitter size={23} />,
    label: "Twitter",
    hover: "group-hover:bg-sky-500 group-hover:text-white",
  },
  {
    icon: <FaFacebookF size={23} />,
    label: "Facebook",
    hover: "group-hover:bg-blue-600 group-hover:text-white",
  },
]

const links = [
    { label: 'Home',    href: null      },
    { label: 'About',   href: 'about'   },
    { label: 'Why',     href: 'why' },
    { label: 'FaQ',     href: 'faq'     },
  ]


const Footer = () => {
  const [inView, setInView] = useState(false)
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .col-anim { opacity: 0; }
        .col-anim.visible {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) var(--delay) forwards;
        }

        .footer-link {
          transition: color 0.2s ease, gap 0.2s ease, padding-left 0.2s ease;
        }
        .footer-link:hover {
          color: white;
          padding-left: 6px;
        }

        .newsletter-input-wrap {
          transition: border-color 0.2s ease;
        }
        .newsletter-input-wrap:focus-within {
          border-color: #facc15;
        }

        .subscribe-btn {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .subscribe-btn:hover {
          background: #eab308;
          transform: translateY(-1px);
        }
        .subscribe-btn:active {
          transform: translateY(0);
        }

        .divider-anim { opacity: 0; }
        .divider-anim.visible {
          animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.55s forwards;
        }
      `}</style>

      <footer
        id="contact"
        ref={footerRef}
        className="bg-[#1E2E44] text-white pt-16 sm:pt-20 pb-8 relative overflow-hidden rounded-tl-[100px] sm:rounded-tl-[160px] md:rounded-tl-[200px] mt-15"
      >
        <div className="max-w-7xl mx-auto px-6 relative">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

            <div style={{ '--delay': '0.1s' }} className={`col-anim ${inView ? 'visible' : ''}`}>
              <div className="flex items-center gap-3 mb-5">
                <img src="/image/Icon.png" className="w-12 sm:w-15" alt="FindPart" />
                <span style={{ fontFamily: "Poppins" }} className="text-xl font-semibold">FindPart</span>
              </div>
              <p style={{ fontFamily: "inter" }} className="text-gray-300 leading-relaxed text-sm max-w-xs">
                FindPart adalah tempat dimana orang orang dapat mencari partner
                dalam mengerjakan project yang sesuai dengan mereka, entah itu
                project internal external dan project besar maupun project kecil
              </p>
            </div>

            <div style={{ '--delay': '0.25s' }} className={`col-anim ${inView ? 'visible' : ''}`}>
              <h2 style={{ fontFamily: "inter" }} className="font-semibold text-lg mb-5 relative w-fit">
                Links
                <img src="image/Links.png" alt="" />
              </h2>
              <ul style={{ fontFamily: "inter" }} className="space-y-3 text-gray-300">
                {links.map(({ label, href }) => (
                  <li
                    key={label}
                    onClick={() => href ? scrollToSection(href) : window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="footer-link cursor-pointer flex items-center gap-2"
                  >
                    <img src="image/Arrow.png" alt="" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ '--delay': '0.4s' }} className={`col-anim ${inView ? 'visible' : ''} sm:col-span-2 lg:col-span-1`}>
              <h2 style={{ fontFamily: "inter" }} className="font-semibold text-lg mb-5 relative w-fit">
                Newsletter
                <img src="image/Newsletter.png" alt="" />
              </h2>

              <div className="newsletter-input-wrap border-b border-gray-400 pb-2 mb-6 flex items-center gap-2 text-gray-300">
                <img className="w-6 flex-shrink-0" src="image/Email.png" alt="" />
                <input
                  type="email"
                  placeholder="Enter Your Email id"
                  className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
                />
                <button
                  style={{ fontFamily: "inter" }}
                  className="subscribe-btn bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-lg flex-shrink-0"
                >
                  Subscribe
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                {socialIcons.map(({ icon, label, hover }) => (
                  <div key={label} className="group flex flex-col items-center cursor-pointer">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white
                      text-[#1E2E44] transition-all duration-300
                      ${hover}
                      group-hover:scale-110 group-hover:-translate-y-1 shadow-md`}>
                      {icon}
                    </div>
                    <span style={{ fontFamily: 'inter' }} className="text-xs sm:text-sm text-white mt-2 opacity-0 translate-y-2
                      group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ fontFamily: 'inter' }} className={`divider-anim ${inView ? 'visible' : ''} border-t border-white/20 mt-14 pt-6 text-center text-gray-400 text-sm`}>
            Copyright | 2026
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;