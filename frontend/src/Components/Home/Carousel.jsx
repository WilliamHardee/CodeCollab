import React from "react";
import { languageIcons } from "../../Data";
import style from "../../Styles/landingpage.module.css";

function Carousel() {
  return (
    <div className={style.carousel}>
      <div className={style.iconContainer}>
        {languageIcons.map((icon) => (
          <div key={icon.name} className={style.icon}>
            <img src={icon.link}></img>
          </div>
        ))}
        {languageIcons.map((icon) => (
          <div key={`${icon.name}2`} className={style.icon}>
            <img src={icon.link}></img>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
