import { useState, useRef, useEffect } from "react";
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
    answer: "Pemilik bisnis dan pencari kerja bisa saling swipe profil. Jika keduanya saling tertarik, maka akan terjadi match dan bisa lanjut ke tahap chat atau diskusi kolaborasi.",
  },
  {
    question: "Apakah saya bisa mencari partner bisnis, bukan hanya pekerjaan?",
    answer: "Bisa. Platform ini dirancang tidak hanya untuk mencari pekerjaan, tetapi juga untuk mencari co-founder, partner bisnis, atau kolaborator proyek.",
  },
  {
    question: "Apakah perlu mengirim CV?",
    answer: "Tidak wajib. Pengguna cukup membuat profil yang berisi skill, pengalaman, dan minat untuk mulai mencari match.",
  },
  {
    question: "Apa yang terjadi setelah match?",
    answer: "Setelah match terjadi, kedua pihak bisa mulai chat, berdiskusi, atau mengatur kerja sama sesuai kebutuhan.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [inView, setInView] = useState(false);
  const refs = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .title-anim { opacity: 0; }
        .title-anim.visible {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.05s forwards;
        }

        .faq-anim { opacity: 0; }
        .faq-anim.visible {
          animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) var(--delay) forwards;
        }

        .faq-btn {
          transition: background 0.2s ease;
        }
        .faq-btn:hover {
          background: #f9f5e7;
        }

        .faq-icon {
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
        }
        .faq-icon.open {
          transform: rotate(180deg);
        }
      `}</style>

      <section id="faq" ref={sectionRef} className="py-16 md:py-20">
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">

          <h2
            style={{ fontFamily: "Poppins" }}
            className={`title-anim ${inView ? 'visible' : ''} font-semibold text-center mb-10 md:mb-16 text-[#1E2A3D]
              text-4xl sm:text-5xl md:text-6xl`}
          >
            FaQ
          </h2>

          <div className="space-y-4 sm:space-y-5">
            {faqData.map((faq, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  style={{ '--delay': `${0.15 + index * 0.1}s` }}
                  className={`faq-anim ${inView ? 'visible' : ''} border border-black rounded-xl overflow-hidden shadow-md transition-shadow duration-300 ${isOpen ? "shadow-lg" : ""}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="faq-btn w-full relative bg-white px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between cursor-pointer shadow-lg gap-4"
                  >
                    <p
                      style={{ fontFamily: "inter" }}
                      className="text-base sm:text-lg font-medium text-[#1E2A3D] pr-10 sm:pr-12"
                    >
                      {faq.question}
                    </p>

                    <img
                      className="faq-icon w-10 h-10 sm:w-13 sm:h-13 absolute right-0 bottom-0"
                      src="image/Faqimg.png"
                      alt=""
                    />
                  </button>

                  <div
                    ref={(el) => (refs.current[index] = el)}
                    style={{
                      height: isOpen ? refs.current[index]?.scrollHeight + "px" : "0px",
                    }}
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
                  >
                    <div
                      style={{ fontFamily: "inter" }}
                      className="bg-[#8C7A39] text-white px-5 sm:px-6 py-4 sm:py-5 text-sm sm:text-base"
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
    </>
  );
};

export default FAQSection;