import style from '../../Styles/home.module.css'

function Button({text}) {
  return (
    <div className={style.button}>{text}</div>
  )
}

export default Button