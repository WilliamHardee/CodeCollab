import React from 'react'
import style from '../../Styles/authforms.module.css'
import TitleCard from '../Global/TitleCard'
import { redirect } from 'react-router'
import { Link } from 'react-router-dom'

function Login() {
  
  return (
    <div className={style.form_container}>
      <form className={style.login}>
        <div className={style.form_title}>
          <TitleCard size="2"/>
        </div>
        <ul className={style.form_body}>
            <li>
                <input 
                className={style.input} 
                type="text" 
                id="username" 
                name="username" 
                placeholder='username'/>
            </li>
            <li>
                <input 
                className={style.input} 
                type="text" 
                id="password" 
                name="password" 
                placeholder='password'/>
            </li>
        </ul>
        <div className={`${style.button} ${style.submittable}`}>
            <input type="submit" value="Log In"/>
          </div>

            <Link to="/CreateAccount">
              <div className={`${style.button} ${style.submittable}`}>Create Account</div>
            </Link>
    
      </form>
    </div>

  )
}

export default Login