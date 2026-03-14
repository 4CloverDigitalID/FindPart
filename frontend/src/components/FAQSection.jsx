import { useState, useRef } from "react";
import "@fontsource/italiana/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const faqData = [
  {
    question: "Bagaimana cara sistem matching bekerja?",
    answer:
      "Pemilik bisnis dan pencari kerja bisa saling swipe profil. Jika keduanya saling tertarik, maka akan terjadi match dan bisa lanjut ke tahap chat atau diskusi kolaborasi.",
  },
  {
    question: "Apakah saya bisa mencari partner bisnis, bukan hanya pekerjaan?",
    answer:
      "Bisa. Platform ini dirancang tidak hanya untuk mencari pekerjaan, tetapi juga untuk mencari co-founder, partner bisnis, atau kolaborator proyek.",
  },
  {
    question: "Apakah perlu mengirim CV?",
    answer:
      "Tidak wajib. Pengguna cukup membuat profil yang berisi skill, pengalaman, dan minat untuk mulai mencari match.",
  },
  {
    question: "Apa yang terjadi setelah match?",
    answer:
      "Setelah match terjadi, kedua pihak bisa mulai chat, berdiskusi, atau mengatur kerja sama sesuai kebutuhan.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const refs = useRef([]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="max-w-[800px] mx-auto px-6">

        <h2
          style={{ fontFamily: "poppins" }}
          className="text-6xl font-semibold text-center mb-16 text-[#1E2A3D]"
        >
          FaQ
        </h2>

        <div className="space-y-5">

          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className={`border border-black rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                  isOpen ? "shadow-lg" : ""
                }`}
              >

                {/* QUESTION */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full relative bg-white px-6 py-5 text-left flex items-center justify-between cursor-pointer shadow-lg"
                >
                  <p
                    style={{ fontFamily: "inter" }}
                    className="text-lg font-medium text-[#1E2A3D]"
                  >
                    {faq.question}
                  </p>

                  <img
                    className="w-13 h-13 absolute right-0 bottom-0"
                    src="image/Faqimg.png"
                    alt=""
                  />
                </button>

                {/* ANSWER */}
                <div
                  ref={(el) => (refs.current[index] = el)}
                  style={{
                    height: isOpen
                      ? refs.current[index]?.scrollHeight + "px"
                      : "0px",
                  }}
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
                >
                  <div
                    style={{ fontFamily: "inter" }}
                    className="bg-[#8C7A39] text-white px-6 py-5"
                  >
                    {faq.answer}
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default FAQSection;