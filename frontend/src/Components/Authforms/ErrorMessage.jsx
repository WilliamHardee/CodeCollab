import React from 'react'

import style from '../../Styles/authforms.module.css'

function ErrorMessage({text}) {
  return (
    <div className={style.errorMessage}>{text}</div>
  )
}

export default ErrorMessage