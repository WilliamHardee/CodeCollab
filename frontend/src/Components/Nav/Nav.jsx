import React from 'react'

import style from '../../Styles/nav.module.css'
import TitleCard from '../Global/TitleCard'

function Nav() {
  return (
    <nav>
        <ul>
            <li><TitleCard/></li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li className={style.nav_login}>Login</li>
        </ul>
    </nav>
  )
}

export default Nav