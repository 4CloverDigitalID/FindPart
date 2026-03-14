import React from 'react'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const AboutUs = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="bg-white rounded-[40px] shadow-md flex items-center justify-between px-10 pt-5 relative overflow-hidden">

          <div className="relative w-[350px] ml-10">
            <img
              src="/image/About-img.png"
              alt="person"
              className="relative z-10 "
            />

          </div>

          <div className="max-w-xl">
            <h2 style={{ fontFamily: "poppins" }} className="text-6xl font-semibold text-[#1E293B]  mb-6">
              About us
            </h2>

            <p style={{ fontFamily: "inter" }} className="text-[#1E293B] leading-relaxed mb-6 text-lg pr-15 text-justify">
              Menjadi platform utama yang mempertemukan UMKM dan talenta
              lokal untuk tumbuh bersama secara berkelanjutan. FindPart
              membantu Anda menemukan kecocokan potensial berdasarkan
              kebutuhan, keterampilan, dan tujuan, terinspirasi dari
              sistem <span className="italic">swipe</span>.
            </p>

            <p style={{ fontFamily: "inter" }} className="text-[#1E293B] italic text-md">
              "No endless listings. No awkward cold emails. <br />
              Just meaningful interactions to thrive towards success"
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}

export default AboutUs
