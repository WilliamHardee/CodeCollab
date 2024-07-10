import { Link } from 'react-router-dom'
import style from '../../Styles/button.module.css'

function Button({text, customStyle, linkto}) {
  return (
    <Link to={linkto} className={style.button} style={customStyle}>
      <div>{text}</div>
    </Link>

  )
}

export default Button