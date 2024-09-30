import { useEffect, useState } from 'react'
import '../css/nav.css'
import line from '../assets/line.svg'

function Nav() {

    return (
        <>
            <nav>
                <a id='nHome' href="">Home</a>
                <img src={line} alt="" />
                <a href="">Order</a>
                <a href="">Table</a>
                <a href="">History</a>
            </nav>
        </>
    )
}

export default Nav
