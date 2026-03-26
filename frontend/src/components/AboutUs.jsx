import React, { useEffect, useRef, useState } from 'react'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const AboutUs = () => {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes quoteReveal {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-anim {
          opacity: 0;
        }
        .card-anim.visible {
          animation: fadeSlideUp 0.75s cubic-bezier(0.4,0,0.2,1) 0.05s forwards;
        }

        .img-anim {
          opacity: 0;
        }
        .img-anim.visible {
          animation: fadeSlideLeft 0.85s cubic-bezier(0.4,0,0.2,1) 0.25s forwards;
        }

        .title-anim {
          opacity: 0;
        }
        .title-anim.visible {
          animation: fadeSlideRight 0.75s cubic-bezier(0.4,0,0.2,1) 0.35s forwards;
        }

        .p1-anim {
          opacity: 0;
        }
        .p1-anim.visible {
          animation: fadeSlideRight 0.7s cubic-bezier(0.4,0,0.2,1) 0.5s forwards;
        }

        .quote-anim {
          opacity: 0;
        }
        .quote-anim.visible {
          animation: quoteReveal 0.7s cubic-bezier(0.4,0,0.2,1) 0.68s forwards;
        }

        .img-hover {
          transition: transform 0.4s ease;
        }
        .img-hover:hover {
          transform: scale(1.03) translateY(-4px);
        }

        .swipe-hl {
          position: relative;
          display: inline-block;
        }
        .swipe-hl::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 38%;
          background: rgba(250, 204, 21, 0.3);
          z-index: -1;
          border-radius: 2px;
        }

        /* Quote left border */
        .quote-bar {
          border-left: 3px solid #facc15;
          padding-left: 14px;
        }
      `}</style>

      <section id='about' ref={sectionRef} className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className={`card-anim ${inView ? 'visible' : ''} bg-white rounded-[32px] md:rounded-[40px] shadow-md overflow-hidden
            flex flex-col md:flex-row items-center justify-between
            px-6 sm:px-8 md:px-10
            pt-8 md:pt-5
            pb-8 md:pb-0
            gap-8 md:gap-4`}
          >

            <div className={`img-anim ${inView ? 'visible' : ''} img-hover flex-shrink-0
              w-48 sm:w-64 md:w-[300px] lg:w-[350px]
              md:ml-6 lg:ml-10`}
            >
              <img
                src="/image/About-img.png"
                alt="person"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="max-w-xl w-full text-center md:text-left pb-0 md:pb-8">

              <h2
                style={{ fontFamily: "Poppins" }}
                className={`title-anim ${inView ? 'visible' : ''} font-semibold text-[#1E293B] mb-5
                  text-4xl sm:text-5xl md:text-5xl lg:text-6xl`}
              >
                About us
              </h2>

              <p
                style={{ fontFamily: "inter" }}
                className={`p1-anim ${inView ? 'visible' : ''} text-[#1E293B] leading-relaxed mb-6 text-justify
                  text-sm sm:text-base md:text-base lg:text-lg
                  md:pr-10 lg:pr-15`}
              >
                Menjadi platform utama yang mempertemukan UMKM dan talenta
                lokal untuk tumbuh bersama secara berkelanjutan. FindPart
                membantu Anda menemukan kecocokan potensial berdasarkan
                kebutuhan, keterampilan, dan tujuan, terinspirasi dari
                sistem <span className="swipe-hl italic">swipe</span>.
              </p>

              <p
                style={{ fontFamily: "inter" }}
                className={`quote-anim ${inView ? 'visible' : ''} quote-bar text-[#1E293B] italic text-left
                  text-sm sm:text-base`}
              >
                "No endless listings. No awkward cold emails. <br className="hidden sm:block" />
                Just meaningful interactions to thrive towards success"
              </p>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default AboutUs