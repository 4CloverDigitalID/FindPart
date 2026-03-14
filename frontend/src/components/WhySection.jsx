import React from "react";
import "@fontsource/italiana/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const WhySection = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2
          style={{ fontFamily: "italiana" }}
          className="text-6xl mb-18 underline underline-offset-8 font-semibold"
        >
          Mengapa Findpart?
        </h2>

        <div className="grid grid-cols-3 gap-10 relative mt-22">
          <img className="absolute -top-20 -left-20 z-10" src="image/Whydesign.png" alt="" />

          <div className="group relative rounded-3xl border bg-white overflow-hidden shadow-sm cursor-pointer
          transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl z-20">

            <div className="h-8 bg-[#1E2A3D]" />

            <div className="flex flex-col items-center justify-center text-center py-10
            transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95">

              <img className="w-28 h-28" src="image/Whyimg1.png" alt="" />

              <p style={{ fontFamily: "inter" }} className="font-medium pt-2 text-lg">
                Sulitnya UMKM
                <br />
                Menemukan
                <br />
                Partner yang
                <br />
                Cocok
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
                Menyederhanakan proses pencarian partner dengan sistem
                pencocokan berbasis kebutuhan dan tujuan bisnis.
              </p>

            </div>

          </div>


          <div className="group relative rounded-3xl border bg-white overflow-hidden shadow-sm cursor-pointer
          transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">

            <div className="h-8 bg-[#1E2A3D]" />

            <div className="flex flex-col items-center justify-center text-center py-10
            transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95">

              <img className="w-23 h-23 mt-2" src="image/Whyimg2.png" alt="" />

              <p style={{ fontFamily: "inter" }} className="font-medium pt-5 text-lg">
                Pencari Kerja Ingin
                <br />
                Kesempatan yang
                <br />
                Lebih Fleksibel
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
                Membuka akses ke peluang kerja dan kolaborasi yang fleksibel
                sesuai keahlian dan minat talenta.
              </p>

            </div>

          </div>


          <div className="group relative rounded-3xl border bg-white overflow-hidden shadow-sm cursor-pointer
          transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl">

            <div className="h-8 bg-[#1E2A3D]" />

            <div className="flex flex-col items-center justify-center text-center py-10
            transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95">

              <img className="w-40" src="image/Whyimg3.png" alt="" />

              <p style={{ fontFamily: "inter" }} className="font-medium pt-5 text-lg">
                Kolaborasi Lokal
                <br />
                Masih Kurang
                <br />
                Terhubung
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
                Membangun ekosistem kolaborasi lokal dalam satu platform
                dengan sistem swipe yang cepat dan transparan.
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default WhySection;