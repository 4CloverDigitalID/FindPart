import React from 'react'
import { Link } from 'react-router-dom'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const Hero = () => {
  return (
    <div className='h-screen shadow-md relative'>
        <img className='w-full h-screen object-cover' src="image/Hero-img.png" alt="" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 style={{ fontFamily: "Poppins" }} className="text-white text-8xl font-semibold mb-3">
            FindPart
            </h1>
            <Link to="/register" style={{ fontFamily: "inter" }} className="bg-yellow-400 text-black px-15 py-3 rounded-xl font-semibold cursor-pointer hover:bg-yellow-500 transition text-xl">
            Gabung Sekarang
            </Link>
      </div>
    </div>
  )
}

export default Hero
