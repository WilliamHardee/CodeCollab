import React, { useState } from 'react'
import style from '../../Styles/authforms.module.css'
import TitleCard from '../Global/TitleCard'
import Message from './Message'
import session from '../../Session'
import { redirect, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("")
  function handleFormSubmit(e) {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))

    fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.status == 200) {
        session.setSession("username", formData.username)
        navigate("/ProjectList")
      }
      else {
        e.target.reset()
        setErrorMsg(res.messages[0])
      }
    })
    .catch((err) => {
      console.log(err)
      errorMsg("Unexpected error occured please try again")
    })
  }
  
  return (
    <div className={style.form_container}>
      <form onSubmit={(e)=>handleFormSubmit(e)} className={style.login}>
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
      {errorMsg && <Message text={errorMsg} error={true}/>}
    </div>

  )
}

export default Login