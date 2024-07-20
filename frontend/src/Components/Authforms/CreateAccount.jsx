import React from 'react'
import TitleCard from '../Global/TitleCard'
import Message from './Message'
import style from '../../Styles/authforms.module.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../Global/Button'

function CreateAccount({setForm, setFormStatus}) {
  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submittable, setSubmittable] = useState(false)


  useEffect(()=> {
    if((userName.length >= 5 && userName.length <= 25)
      && password.length >= 5&& password.length <= 25) {
      setSubmittable(true)
    }
    else {
      setSubmittable(false)
    }

  }, [userName, password])


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
          setFormStatus(["Account Created", false])
          
          setForm("login")
        }
        else {
          setFormStatus([res.messages[0], true])
          setSubmittable(false)
        }
      })
      .catch((e) => {
        setFormStatus(["An unexpected error occurred", true]);
        setSubmittable(false)

      })
  }

  function switchForm() {
    setForm("login")
    setFormStatus(["", true])
  }
  return (
    <div className={style.form_container}>

      <form onSubmit={(e)=>handleFormSubmit(e)}className={style.authForm}>
          <h1>Create Account</h1>
         
                  <input 
                  onChange={(e)=> setUsername(e.target.value)} 
                  className={style.input} 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder='username'
                  max="20"/>
            
                  <input 
                  onChange={(e)=> setPassword(e.target.value)} 
                  className={style.input} 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder='password' 
                  max="20"/>
              
           

           <Button text="Create" clickable={submittable}  isSubmit={true}/>
           <Button text= "Log in" onClick={() => switchForm()} clickable={true}/>
    
      </form>
  
    </div>
  )
}

export default CreateAccount