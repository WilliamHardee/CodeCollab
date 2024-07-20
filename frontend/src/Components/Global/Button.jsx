import style from '../../Styles/button.module.css'

function Button({text, onClick, clickable, isSubmit}) {

  return (
    <button 
      type={isSubmit ? "submit" : "button"} 
      className={`${style.button} ${clickable ? style.valid : style.invalid}`} 
      onClick={clickable && !isSubmit ? onClick : null} 
      disabled={!clickable}
    >
      {text}
    </button>
  )
}

export default Button
