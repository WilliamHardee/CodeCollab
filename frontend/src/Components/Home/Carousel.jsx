import React from 'react'
import { languageIcons } from '../../Data'
import style from '../../Styles/landingpage.module.css'

function Carousel() {
  return (
    <div className={style.carousel}>
        <div className={style.iconContainer}>
            {languageIcons.map((icon) => (
                <div className={style.icon}>
                    <img key={icon.name} src={icon.link}></img>
                </div>
            ))}
            {languageIcons.map((icon) => (
                <div className={style.icon}>
                    <img key={icon.name} src={icon.link}></img>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Carousel