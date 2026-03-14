import React from 'react'
import SuccessStory from '../home/SuccessStory'
import AboutUs from '../home/AboutUs'
import HowitWork from '../home/HowitWork'
import Footer from '../home/Footer'

const Stories = () => {
  return (
    <div className="pt-24 bg-gray-50">
        {/* <div className="container mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Inspiring Success Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how countless individuals have found their life partners through our platform. Each story is a testament to our commitment to helping you find true love.
            </p>
        </div> */}
        <SuccessStory/>
        <AboutUs/>
        <HowitWork/>
        <Footer/>
    </div>
  )
}

export default Stories