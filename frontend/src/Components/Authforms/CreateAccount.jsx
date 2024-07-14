import React from 'react'
import TitleCard from '../Global/TitleCard'
import Message from './Message'
import style from '../../Styles/authforms.module.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function CreateAccount() {
  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confpassword, setConfpassword] = useState("")
  const [submittable, setSubmittable] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(()=> {
    if(userName.length == 0 && password.length == 0 && confpassword.length == 0) {
      setErrorMsg("")
      setSubmittable(false)
    }
    else if(userName.length < 5) {
        setErrorMsg("Username too short")
        setSubmittable(false)
    }
    else if(userName.length > 20) {
      setErrorMsg("Username too long")
      setSubmittable(false)
    }
    else if(password.length < 5) {
      setErrorMsg("Password too short")
      setSubmittable(false)
    }
    else if(password.length > 20) {
      setErrorMsg("Password too long")
      setSubmittable(false)
    }
    else if(password !== confpassword) {
      setErrorMsg("Passwords do not match")
      setSubmittable(false)
    }
    else {
      setErrorMsg("")
      setSubmittable(true)
    }
  }, [userName, password, confpassword])


  function handleFormSubmit(e) {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.target))

      fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: formData.username,
                              password: formData.password})
        
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.status == 201) {
          setSuccessMsg("Account Created")
          setErrorMsg("")
          e.target.reset()
        }
        else {
          setErrorMsg(res.messages[0])
        }
      })
      .catch((e) => {
        setErrorMsg("An unexpected error occurred");
        setSuccessMsg("")
      })

  }

  return (
    <div className={style.form_container}>

      <form onSubmit={(e)=>handleFormSubmit(e)}className={style.create_account}>
          <div className={style.form_title}>
            <TitleCard size="2"/>
          </div>
          <ul className={style.form_body}>
              <li>
                  <input 
                  onChange={(e)=> setUsername(e.target.value)} 
                  className={style.input} 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder='username'
                  max="20"/>
              </li>
              <li>
                  <input 
                  onChange={(e)=> setPassword(e.target.value)} 
                  className={style.input} 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder='password' 
                  max="20"/>
              </li>
              <li>
                  <input 
                  onChange={(e)=> setConfpassword(e.target.value)} 
                  className={style.input} 
                  type="password" 
                  id="password-conf" 
                  name="password-conf" 
                  placeholder='confirm password'/>
              </li>
          </ul>

          <div className={`${style.button} ${submittable ? style.submittable : style.notSubmittable}`}>
            <input type="submit" value="Create Account"/>
          </div>

            <Link to="/Login">
              <div className={`${style.button} ${style.submittable}`}>Login</div>
            </Link>
    
      </form>
      {errorMsg && <Message text={errorMsg} error={true}/>}
      {successMsg && !errorMsg && <Message text={successMsg} error={false}/>}
   
    </div>
  )
}

export default CreateAccount