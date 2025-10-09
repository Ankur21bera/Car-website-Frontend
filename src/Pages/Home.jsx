import React from 'react'
import Hero from '../Components/Hero'
import Featuredsection from '../Components/Featuredsection'
import Banner from '../Components/Banner'
import Testimonial from '../Components/Testimonial'
import Newsletterbox from '../Components/Newsletterbox'

const Home = () => {
  return (
    <div>
        <Hero/>
        <Featuredsection/>
        <Banner/>
        <Testimonial/>
        <Newsletterbox/>
    </div>
  )
}

export default Home