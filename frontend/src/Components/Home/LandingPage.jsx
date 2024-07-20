import React, { useState } from 'react'
import style from '../../Styles/landingpage.module.css'
import Login from '../Authforms/Login'
import Button from '../Global/Button'
import CreateAccount from '../Authforms/CreateAccount'
import IOMessage from '../Global/IOMessage'
import Carousel from './Carousel'
import Title from './Title'

function LandingPage() {
    const [formStatus, setFormStatus] = useState(["", false])
    const [form, setForm] = useState("login")
  return (
    <div className={style.container}>
        <div className={style.infocontainer}>
            <Title/>
            <p>
                Welcome to the premier online coding platform! Here, you can create projects
                in all popular programming languages and invite collaborators from around the world. 
                Join our community of developers, share your ideas, and build amazing software together!
            </p>
            <Carousel/>
        </div>
        <div>
            {form === "login" ? <Login setForm={setForm} 
                                setFormStatus={setFormStatus}/> : null}
            {form === "create" ? <CreateAccount setForm={setForm}
                                setFormStatus={setFormStatus}/> : null}
            <IOMessage message={formStatus[0]} error={formStatus[1]}/>
        </div>
    </div>
  )
}

export default LandingPage