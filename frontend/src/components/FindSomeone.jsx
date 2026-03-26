import React, { useEffect, useRef, useState } from 'react'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const FindSomeone = () => {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-left {
          opacity: 0;
        }
        .anim-left.visible {
          animation: fadeSlideLeft 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
        }

        .anim-right {
          opacity: 0;
        }
        .anim-right.visible {
          animation: fadeSlideRight 0.8s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
        }

        .anim-p {
          opacity: 0;
        }
        .anim-p.visible {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.55s forwards;
      }

        .swipe-highlight {
          position: relative;
          display: inline-block;
        }
        .swipe-highlight::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background: rgba(250, 204, 21, 0.3);
          z-index: -1;
          border-radius: 2px;
        }
      `}</style>

      <section ref={sectionRef} className="py-16 md:py-20 mt-5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">

          <div className="max-w-xl w-full text-center md:text-left">
            <h1
              style={{ fontFamily: "Poppins" }}
              className={`anim-left ${inView ? 'visible' : ''} font-semibold text-[#1E293B] leading-tight mb-6
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}
            >
              Find someone <br />
              who fits your <br />
              idea!
            </h1>

            <p
              style={{ fontFamily: "inter" }}
              className={`anim-p ${inView ? 'visible' : ''} text-[#1E293B] leading-relaxed
                text-base sm:text-lg md:text-xl`}
            >
              Mempertemukan UMKM, startup, dan talenta cepat dan intuitif.
              Cari partner bisnis, asisten, atau peluang kerja dalam satu
              platform berbasis sistem{' '}
              <span className="swipe-highlight italic">swipe</span>{' '}
              di mana saja, kapan saja!
            </p>
          </div>

          <div
            className={`anim-right ${inView ? 'visible' : ''} img-wrap rounded-2xl overflow-hidden flex-shrink-0
              w-full max-w-sm
              sm:max-w-md
              md:w-[380px] md:h-[460px]
              lg:w-[420px] lg:h-[500px]`}
          >
            <img
              src="/image/FindImage.png"
              alt="person"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>
    </>
  )
}

export default FindSomeone