import React from 'react'
import TitleCard from '../Global/TitleCard'
import style from '../../Styles/authforms.module.css'

function CreateAccount() {
  return (
    <form className={style.create_account}>
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
            <li>
                <input className={style.input} type="text" id="password-conf" name="password-conf" placeholder='confirm password'/>
            </li>
        </ul>
        <input className={style.button} type="submit" value="Create Account"/>\
        <input className={style.button} type="submit" value="Log In"/>

        
    </form>
  )
}

export default CreateAccount