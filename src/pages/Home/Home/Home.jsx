import React from 'react'
import Banner from '../Banner/Banner'
import { Services } from './Services'
import { ClientLogosMarquee } from '../ClientLogosMarquee/ClientLogosMarquee'
import Benefits from '../../Benifits/Benifits'
import BeMerchant from '../BeMerchant/BeMerchant'
import CustomerReview from '../CustomerReview/CustomerReview'
import Faq from '../Faq/Faq'

const Home = () => {
  return (
    <>
      <Banner />
      <Services />
      <ClientLogosMarquee />
      <Benefits />
      <BeMerchant />
      <CustomerReview />
      <Faq />
    </>
  )
}

export default Home
