import { useEffect, useState } from 'react'
// import axios from 'axios'
import './css/dashboard.css'
import Ramen from './assets/rameng.svg'
import Image from './assets/Drink.svg'
import Image2 from './assets/image.svg'
import image3 from './assets/image2.svg'

import Nav from './components/navbar'

function App() {

  return (
    <>
      <Nav></Nav>
      <img src={Ramen} alt="" />
      <img className='image3' src={image3} alt="" />
      <main>
        <div className="container">
          <p className='apaya'>ゼニス</p>
          <h2>we offer you <br />the best we have</h2>
          <div className="fos">
            <p className='in'>FOS</p>
            <p className='out'>FOS</p>
            <img src={Image} alt="" />
            <img className='image2' src={Image2} alt="" />
          </div>
          <p className='price'>IDR 60K</p>
        </div>
      </main>
    </>
  )
}

export default App
