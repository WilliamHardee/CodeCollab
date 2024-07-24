import React from 'react'

import { Link, useNavigate } from 'react-router-dom'

import style from '../../Styles/nav.module.css'
import TitleCard from '../Global/TitleCard'

function Nav() {

  return (
    <nav>
        <ul className={style.nav_bar}>
          <Link className={style.nav_item} to="/">
            <li><TitleCard/></li>
          </Link>
            <li className={style.nav_item}>item</li>
            <li className={style.nav_item}>item</li>
            <li className={style.nav_item}>item</li>
            <li className={`${style.nav_login} ${style.nav_item}`}>Login</li>
        </ul>
    </nav>
  )
}

export default Nav