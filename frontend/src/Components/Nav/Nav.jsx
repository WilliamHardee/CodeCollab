import React from 'react'

import style from '../../Styles/nav.module.css'
import TitleCard from '../Global/TitleCard'

function Nav() {
  return (
    <nav>
        <ul className={style.nav_bar}>
            <li className={style.nav_item}><TitleCard/></li>
            <li className={style.nav_item}>item</li>
            <li className={style.nav_item}>item</li>
            <li className={style.nav_item}>item</li>
            <li className={`${style.nav_login} ${style.nav_item}`}>Login</li>
        </ul>
    </nav>
  )
}

export default Nav