import React, { useEffect, useRef, useState } from 'react'
import "@fontsource/italiana/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const WorkFlow = () => {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .anim-title { opacity: 0; }
        .anim-title.visible {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
        }

        .anim-card1 { opacity: 0; }
        .anim-card1.visible {
          animation: fadeLeft 0.75s cubic-bezier(0.4,0,0.2,1) 0.25s forwards;
        }

        .anim-card2 { opacity: 0; }
        .anim-card2.visible {
          animation: fadeLeft 0.75s cubic-bezier(0.4,0,0.2,1) 0.45s forwards;
        }

        .anim-refresh { opacity: 0; }
        .anim-refresh.visible {
          animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.35s forwards;
        }

        .anim-flow { opacity: 0; }
        .anim-flow.visible {
          animation: fadeRight 0.85s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
        }

        .refresh-icon {
          transition: transform 0.5s ease;
          cursor: pointer;
        }
        .refresh-icon:hover {
          animation: spinSlow 0.7s ease forwards;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        @keyframes floatImg {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .float-img {
          animation: floatImg 5s ease-in-out infinite;
        }
      `}</style>

      <section id='mission' ref={sectionRef} className="bg-gradient-to-b from-[#FED000] via-yellow-300 to-[#F8FAFC] py-20 md:py-24 mt-15">
        <div className="max-w-7xl mx-auto px-6">

          <div className={`anim-title ${inView ? 'visible' : ''} block lg:hidden text-center mb-10`}>
            <h2
              style={{ fontFamily: "italiana" }}
              className="text-3xl sm:text-4xl font-semibold text-[#1E293B] underline underline-offset-8"
            >
              Bisa digunakan siapa saja?
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">

            <div className="flex flex-col gap-8 sm:gap-10 items-center w-full lg:w-auto">

              <div className={`anim-card1 ${inView ? 'visible' : ''} card-hover bg-[#1E293B] text-white p-8 py-10 rounded-3xl shadow-lg text-center
                w-full max-w-[310px]`}
                style={{ fontFamily: "Inter" }}
              >
                <img className='mx-auto w-16 h-16 sm:w-18 sm:h-18 mb-3' src="image/Profile-flow.png" alt="" />
                <h3 className="font-semibold text-xl">User 1</h3>
                <p className="text-md mb-1 font-medium mt-4">Partner Kerja</p>
                <p className="text-sm text-gray-300">
                  Mencari pemilik ide yang cocok untuk diajak bekerja sama
                  mengerjakan project, company dan lain lain
                </p>
              </div>

              <div className={`anim-refresh ${inView ? 'visible' : ''}`}>
                <img className='refresh-icon w-20 h-20 sm:w-25 sm:h-25' src="image/Refresh.png" alt="" />
              </div>

              <div className={`anim-card2 ${inView ? 'visible' : ''} card-hover bg-[#1E293B] text-white p-8 py-10 rounded-3xl shadow-lg text-center
                w-full max-w-[310px]`}
                style={{ fontFamily: "Inter" }}
              >
                <img className='mx-auto w-16 h-16 sm:w-18 sm:h-18 mb-3' src="image/Profile-flow.png" alt="" />
                <h3 className="font-semibold text-xl">User 2</h3>
                <p className="text-md mb-1 font-medium mt-4">Pemilik Ide</p>
                <p className="text-sm text-gray-300">
                  Mencari partner kerja yang cocok diajak bekerja sama
                  untuk menjalankan ide project dari pemilik ide
                </p>
              </div>

            </div>

            <div className={`anim-flow ${inView ? 'visible' : ''} flex flex-col items-center justify-center flex-1 w-full`}>

              <h2
                style={{ fontFamily: "italiana" }}
                className="hidden lg:block text-4xl xl:text-5xl font-semibold text-[#1E293B] text-center mb-12 underline underline-offset-8"
              >
                Bisa digunakan siapa saja?
              </h2>

              <img
                className='float-img w-full max-w-[360px] sm:max-w-[500px] md:max-w-[620px] lg:max-w-[800px]'
                src="image/Flow-img.png"
                alt="workflow diagram"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default WorkFlow