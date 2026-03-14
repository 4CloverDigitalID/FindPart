import React from 'react'
import "@fontsource/italiana/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const WorkFlow = () => {
  return (
    <section className="bg-gradient-to-b from-[#FED000] via-yellow-300 to-[#F8FAFC] py-24 mt-15">
        <div className="max-w-7xl mx-auto px-6">

            <div className="flex items-start justify-between gap-16">

            <div className="flex flex-col gap-10 justify-center items-center">

                <div style={{ fontFamily: "Inter" }} className="bg-[#1E293B] text-white p-8 py-12  rounded-3xl w-[310px] shadow-lg text-center justify-center">
                        <img className='mx-auto w-18 h-18 mb-3' src="image/Profile-flow.png" alt="" />
                        <h3 className="font-semibold text-xl">User 1</h3>
                        <p className="text-md mb-1 font-medium mt-5">Partner Kerja</p>

                        <p className="text-sm text-gray-300">
                            Mencari pemilik ide yang cocok untuk diajak bekerja sama
                            mengerjakan project, company dan lain lain
                        </p>
                </div>  

                    <img className='w-25 h-25 justify-center' src="image/Refresh.png" alt="" />

                    <div style={{ fontFamily: "Inter" }} className="bg-[#1E293B] text-white p-8 py-12 rounded-3xl w-[310px] shadow-lg text-center">
                        <img className='mx-auto w-18 h-18 mb-3' src="image/Profile-flow.png" alt="" />
                        <h3 className="font-semibold text-xl">User 2</h3>
                        <p className="text-md mb-1 font-medium mt-5">Pemilik Ide</p>

                        <p className="text-sm text-gray-300">
                            Mencari partner kerja yang cocok diajak bekerja sama
                            untuk menjalankan ide project dari pemilik ide
                        </p>    
                    </div>

            </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className='text-center'>
                <h2 style={{ fontFamily: "italiana" }} className="text-5xl font-semibold text-[#1E293B] text-center mb-16 underline underline-offset-8">
                    Bisa digunakan siapa saja?
                </h2>   
            </div>

            <img className='w-[800px]' src="image/Flow-img.png" alt="" />
            
          </div>

        </div>

      </div>
    </section>
  )
}

export default WorkFlow

