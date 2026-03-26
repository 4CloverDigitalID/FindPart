import React, { useEffect, useRef, useState } from "react";
import "@fontsource/italiana/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const cards = [
  {
    img: "image/Whyimg1.png",
    imgClass: "w-28 h-28",
    front: "Sulitnya UMKM\nMenemukan\nPartner yang\nCocok",
    back: "Menyederhanakan proses pencarian partner dengan sistem pencocokan berbasis kebutuhan dan tujuan bisnis.",
    delay: "0.15s",
    animDelay: "0.2s",
  },
  {
    img: "image/Whyimg2.png",
    imgClass: "w-23 h-23 mt-2",
    front: "Pencari Kerja Ingin\nKesempatan yang\nLebih Fleksibel",
    back: "Membuka akses ke peluang kerja dan kolaborasi yang fleksibel sesuai keahlian dan minat talenta.",
    delay: "0.30s",
    animDelay: "0.35s",
  },
  {
    img: "image/Whyimg3.png",
    imgClass: "w-40",
    front: "Kolaborasi Lokal\nMasih Kurang\nTerhubung",
    back: "Membangun ekosistem kolaborasi lokal dalam satu platform dengan sistem swipe yang cepat dan transparan.",
    delay: "0.45s",
    animDelay: "0.5s",
  },
]

const WhySection = () => {
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
      <section id="why" ref={sectionRef} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">

          <h2
            style={{ fontFamily: "italiana" }}
            className={`title-anim ${inView ? 'visible' : ''} text-4xl sm:text-5xl md:text-6xl mb-12 md:mb-18 underline underline-offset-8 font-semibold`}
          >
            Mengapa Findpart?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative mt-10 md:mt-22">

            <img
              className={`deco-anim ${inView ? 'visible' : ''} hidden md:block absolute -top-20 -left-20 z-10`}
              src="image/Whydesign.png"
              alt=""
            />

            {cards.map((card, i) => (
              <div
                key={i}
                style={{ '--delay': card.delay }}
                className={`card-anim ${inView ? 'visible' : ''} group relative rounded-3xl border bg-white overflow-hidden shadow-sm cursor-pointer
                  transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl
                  ${i === 0 ? 'z-20' : ''}`}
              >
                <div className="h-8 bg-[#1E2A3D]" />

                <div className="flex flex-col items-center justify-center text-center py-10
                  transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95">
                  <img className={card.imgClass} src={card.img} alt="" />
                  <p style={{ fontFamily: "inter" }} className="font-medium pt-4 text-lg whitespace-pre-line">
                    {card.front}
                  </p>
                </div>

                <div className="absolute inset-0 bg-yellow-400
                  translate-y-full group-hover:translate-y-0
                  transition-transform duration-500 ease-out
                  flex items-center justify-center text-center p-6">
                  <p
                    style={{ fontFamily: "inter" }}
                    className="text-lg font-medium opacity-0 group-hover:opacity-100
                      transition-opacity duration-700 delay-200"
                  >
                    {card.back}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>
    </>
  )
}

export default WhySection;