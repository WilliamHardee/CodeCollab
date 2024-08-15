import style from '../../Styles/button.module.css'

function Button({text, onClick, clickable, isSubmit, loading}) {

  return (
    <button 
      type={isSubmit ? "submit" : "button"} 
      className={`${style.button} ${clickable ? style.valid : style.invalid}`} 
      onClick={clickable && !isSubmit ? onClick : null} 
      disabled={!clickable}
    >
      <div className={style.buttonContent}>
        {loading && <div className={style.loader}></div>}
        {text}
      </div>
    </button>
  )
}

export default Button
