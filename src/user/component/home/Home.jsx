import React from 'react'
import HeroSection from './HeroSection'
import AboutUs from './AboutUs'
import Matrimonialpackage from './Matrimonialpackage'
import HowitWork from './HowitWork'
import SuccessStory from './SuccessStory'
import Testimonial from './Testimonial'
import FrequentQuestion from './FrequentQuestion'
import Footer from './Footer'
import FindSomeOne from './FindSomeOne'

const Home = () => {
  return (
    <div>
        <HeroSection/>
        <FindSomeOne/>
        <AboutUs/>
        <Matrimonialpackage/>
        <HowitWork/>
        <SuccessStory/>
        <Testimonial/>
        <FrequentQuestion/>
        <Footer/>
    </div>
  )
}

export default Home