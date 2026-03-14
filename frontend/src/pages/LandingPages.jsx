import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FindSomeone from '../components/FindSomeone'
import AboutUs from '../components/AboutUs'
import WorkFlow from '../components/WorkFlow'
import WhySection from '../components/WhySection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'

const LandingPages = () => {
  return (
    <div className=' bg-[#F8FAFC]'>
      <Navbar />
      <Hero />
      <FindSomeone />
      <AboutUs />
      <WorkFlow />
      <WhySection />
      <FAQSection />
      <Footer />
    </div>
  )
}

export default LandingPages
