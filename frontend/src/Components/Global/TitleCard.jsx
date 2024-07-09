import React from 'react'
import style from '../../Styles/titleCard.module.css'

function TitleCard({size}) {
  return (
    <h1 style={{fontSize: size + 'rem'}}><span className={style.green}>&lt;Code&gt;</span> Collab</h1>
  )
}

export default TitleCard