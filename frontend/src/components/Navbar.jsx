import React from 'react'
import { Link } from 'react-router-dom'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const Navbar = () => {
  return (
    <nav className="w-full fixed  bg-black text-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">
            <img className='w-17 h-15' src="image/Icon.png" alt="FindPart Logo" />
          <span style={{ fontFamily: "Poppins" }} className="font-semibold text-xl">FindPart</span>
        </div>

        <ul style={{ fontFamily: "inter" }} className="flex gap-8 text-lg">
          <li className="cursor-pointer hover:text-yellow-400">About</li>
          <li className="cursor-pointer hover:text-yellow-400">FaQ</li>
          <li className="cursor-pointer hover:text-yellow-400">Mission</li>
          <li className="cursor-pointer hover:text-yellow-400">Contact</li>
        </ul>

        <div style={{ fontFamily: "inter" }} className="flex items-center gap-3">
          <Link to="/login" className="bg-yellow-400 text-black px-10 py-2 rounded-xl">
            Masuk
          </Link>

          <Link to="/register" className="bg-gray-200 text-black px-10 py-2 rounded-xl">
            Daftar
          </Link>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
