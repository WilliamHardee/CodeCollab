import React, { useState, useEffect, useReducer } from "react";
import style from "../../Styles/authforms.module.css";
import TitleCard from "../Global/TitleCard";
import Message from "./Message";
import session from "../../Session";
import { redirect, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Button from "../Global/Button";
import { authFormInitialState, formReducer } from "../Global/formReducer";

function Login({ state, dispatch, setForm }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      state.username.length >= 5 &&
      state.username.length <= 25 &&
      state.password.length >= 5 &&
      state.password.length <= 25
    ) {
      dispatch({type: "VALID"})
    } else {
      dispatch({type: "INVALID"})
    }
  }, [state.username, state.password]);


  async function handleFormSubmit(e) {
    e.preventDefault();
    dispatch({type:"FETCH_START"})
    try {
      const formData = Object.fromEntries(new FormData(e.target));
      const response = await fetch("https://localhost:8443/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.messages[0] || "Login failed")
      }

      const jsonResult = await response.json();
      session.setSession("username", formData.username);
      navigate("/ProjectList");
     
    } catch (err) {
      e.target.reset();
      dispatch({type: "FETCH_ERROR", payload: err.message || "Unexpected Error"})
    }
    finally {
      dispatch({type:"FETCH_END"})
    }
  }


  function handleTextChange(e) {
    dispatch({type: "UPDATE_FIELD", payload: {name:e.target.name, value: e.target.value}})
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} className={style.authForm}>
        <h1>Log In</h1>

        <input
          onChange={(e) => handleTextChange(e)}
          className={style.input}
          type="text"
          id="username"
          name="username"
          placeholder="username"
          max="25"
        />

        <input
          onChange={(e) => handleTextChange(e)}
          className={style.input}
          type="password"
          id="password"
          name="password"
          placeholder="password"
          max="25"
        />

        <Button text="Log In" clickable={state.isValid} isSubmit={true} />
        <Button
          text="Create Account"
          onClick={() => setForm("create")}
          clickable={true}
        />
      </form>
    </>
  );
}

export default Login;
