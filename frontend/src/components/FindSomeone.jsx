import React from 'react'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const FindSomeone = () => {
  return (
    <section className=" py-20 mt-5">
      <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">

        <div className="max-w-xl">
          <h1 style={{ fontFamily: "Poppins" }} className="text-7xl font-semibold text-[#1E293B] leading-tight mb-6">
            Find someone <br />
            who fits your <br />
            idea!
          </h1>

          <p style={{ fontFamily: "inter" }} className="text-[#1E293B] text-xl leading-relaxed">
            Mempertemukan UMKM, startup, dan talenta cepat dan intuitif.
            Cari partner bisnis, asisten, atau peluang kerja dalam satu
            platform berbasis sistem <span className="italic">swipe</span> di mana saja,
            kapan saja!
          </p>
        </div>

        <div className="w-[420px] h-[500px] overflow-hidden">
          <img
            src="/image/FindImage.png"
            alt="person"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  )
}

export default FindSomeone
