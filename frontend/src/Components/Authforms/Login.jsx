import React from 'react'
import style from '../../Styles/authforms.module.css'
import TitleCard from '../Global/TitleCard'

function Login() {
  return (
    <form className={style.login}>
        <div className={style.form_title}>
          <TitleCard size="2"/>
        </div>
        <ul className={style.form_body}>
            <li>

                <input className={style.input} type="text" id="username" name="username" placeholder='username'/>
            </li>
            <li>
                <input className={style.input} type="text" id="password" name="password" placeholder='password'/>
            </li>
        </ul>
        <input className={style.button} type="submit" value="Log In"/>
        <input className={style.button} type="submit" value="Create Account"/>
       


        
    </form>
  )
}

export default Login