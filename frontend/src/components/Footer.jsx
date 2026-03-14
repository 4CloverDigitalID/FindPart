import React from "react";
import { FaInstagram, FaWhatsapp, FaTwitter, FaFacebookF } from "react-icons/fa";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

const Footer = () => {
  return (
    <footer className="bg-[#1E2E44] text-white pt-20 pb-8 relative overflow-hidden rounded-tl-[200px] mt-15">

      {/* curved top */}

      <div className="max-w-7xl mx-auto px-6 relative">

        <div className="grid grid-cols-3 gap-16">

          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/image/Icon.png" className="w-15" />
              <span style={{ fontFamily: "poppins" }} className="text-xl font-semibold">FindPart</span>
            </div>

            <p style={{ fontFamily: "inter" }} className="text-white leading-relaxed text-sm max-w-xs">
              FindPart adalah tempat dimana orang orang dapat mencari partner
              dalam mengerjakan project yang sesuai dengan mereka, entah itu
              project internal external dan project besar maupun project kecil
            </p>
          </div>


          {/* LINKS */}
          <div>
            <h2 style={{ fontFamily: "inter" }} className="font-semibold text-lg mb-6 relative w-fit">
              Links
                <img src="image/Links.png" alt="" />
            </h2>

            <ul style={{ fontFamily: "inter" }} className="space-y-3 text-gray-300">

              <li className="hover:text-white transition cursor-pointer flex items-center gap-2">
                <img src="image/Arrow.png" alt="" />
                Home
              </li>

              <li className="hover:text-white transition cursor-pointer flex items-center gap-2">
                <img src="image/Arrow.png" alt="" />
                About
              </li>

              <li className="hover:text-white transition cursor-pointer flex items-center gap-2">
                <img src="image/Arrow.png" alt="" />
                Why
              </li>

              <li className="hover:text-white transition cursor-pointer flex items-center gap-2">
                <img src="image/Arrow.png" alt="" />
                FaQ
              </li>

            </ul>
          </div>


          {/* NEWSLETTER */}
          <div>
            <h2 style={{ fontFamily: "inter" }} className="font-semibold text-lg mb-6 relative w-fit">
              Newsletter
              <img src="image/Newsletter.png" alt="" />
            </h2>

            {/* input */}
            <div className="border-b border-gray-400 pb-2 mb-6 flex items-center gap-2 text-gray-300">
                <img className="w-6" src="image/Email.png" alt="" />
              <input
                type="email"
                placeholder="Enter Your Email id"
                className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
              />
            </div>


            {/* SOCIAL ICONS */}
            <div className="flex gap-3">

                {/* Instagram */}
                <div className="group flex flex-col items-center cursor-pointer">

                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white
                    text-[#1E2E44] transition-all duration-300
                    group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-yellow-400
                    group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1 shadow-md">

                    <FaInstagram size={23} />

                    </div>

                    <span style={{ fontFamily: 'inter' }} className="text-sm text-white mt-2 opacity-0 translate-y-2
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
                    Instagram
                    </span>

                </div>


                {/* WhatsApp */}
                <div className="group flex flex-col items-center cursor-pointer">

                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white
                    text-[#1E2E44] transition-all duration-300
                    group-hover:bg-green-500 group-hover:text-white
                    group-hover:scale-110 group-hover:-translate-y-1 shadow-md">

                    <FaWhatsapp size={23} />

                    </div>

                    <span style={{ fontFamily: 'inter' }} className="text-sm text-white mt-2 opacity-0 translate-y-2
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
                    WhatsApp
                    </span>

                </div>


                {/* Twitter */}
                <div className="group flex flex-col items-center cursor-pointer">

                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white
                    text-[#1E2E44] transition-all duration-300
                    group-hover:bg-sky-500 group-hover:text-white
                    group-hover:scale-110 group-hover:-translate-y-1 shadow-md">

                    <FaTwitter size={23} />

                    </div>

                    <span style={{ fontFamily: 'inter' }} className="text-sm text-white mt-2 opacity-0 translate-y-2
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
                    Twitter
                    </span>

                </div>


                {/* Facebook */}
                <div className="group flex flex-col items-center cursor-pointer">

                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white
                    text-[#1E2E44] transition-all duration-300
                    group-hover:bg-blue-600 group-hover:text-white
                    group-hover:scale-110 group-hover:-translate-y-1 shadow-md">

                    <FaFacebookF size={23} />

                    </div>

                    <span style={{ fontFamily: 'inter' }} className="text-sm text-white mt-2 opacity-0 translate-y-2
                    group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
                    Facebook
                    </span>

                </div>

                </div>
          </div>
        </div>


        {/* Divider */}
        <div style={{ fontFamily: 'inter' }} className="border-t border-white mt-16 pt-6 text-center text-white text-sm">
          Copyright | 2026
        </div>

      </div>
    </footer>
  );
};

export default Footer;