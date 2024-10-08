import React, { useReducer, useEffect, useState } from "react";
import style from "../../Styles/landingpage.module.css";
import Login from "../Authforms/Login";
import Button from "../Global/Button";
import CreateAccount from "../Authforms/CreateAccount";
import IOMessage from "../Global/IOMessage";
import Carousel from "./Carousel";
import Title from "./Title";
import { useNavigate } from "react-router";
import session from "../../Session";
import { authFormInitialState, formReducer } from "../Global/formReducer";


function LandingPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(formReducer, authFormInitialState)
  const [form, setForm] = useState("login");

  useEffect(() => {dispatch({type: "FORM_RESET", payload: authFormInitialState})}, [form])
  useEffect(() => {fetchUsername()}, [])

  async function fetchUsername() {
    try {
      const response = await fetch("http://localhost:8443/user", {credentials: "include"})
      if(response.status == 200) {
        navigate("/projectList")
        return
      }
    }
    catch (e) {
      return
    }
  }

  return (
    <div className={style.container}>
      <div className={style.infocontainer}>
        <Title />
        <p>
          Welcome to the premier online coding platform! Here, you can create
          projects in all popular programming languages and invite collaborators
          from around the world. Join our community of developers, share your
          ideas, and build amazing software together!
        </p>
        <Carousel />
      </div>
      <div>
        {form === "login" ? (
          <Login setForm={setForm} state={state} dispatch={dispatch}/>
        ) : null}
        {form === "create" ? (
          <CreateAccount setForm={setForm} state={state} dispatch={dispatch}/>
        ) : null}
        <IOMessage message={state.errorMsg} error={state.error} />
      </div>
    </div>
  );
}

export default LandingPage;
