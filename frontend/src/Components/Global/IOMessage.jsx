import React, { useEffect, useState } from 'react'
import style from '../../Styles/iomessage.module.css'

function IOMessage({message, error}) {
  const [mesageStyle, setMessageStyle] = useState(null)

  useEffect(() => {
    error ? setMessageStyle(style.error) : setMessageStyle(style.success)
  }, [error])
  
  return (
    <div className={`${style.ioMessage} ${message ? mesageStyle : style.up}`}>{message}</div>
  )
}

export default IOMessage