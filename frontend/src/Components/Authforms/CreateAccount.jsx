import React from "react";
import TitleCard from "../Global/TitleCard";
import Message from "./Message";
import style from "../../Styles/authforms.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../Global/Button";

function CreateAccount({ state, dispatch, setForm }) {
  useEffect(() => {
    if (
      state.username.length >= 5 &&
      state.username.length <= 25 &&
      state.password.length >= 5 &&
      state.password.length <= 25
    ) {
      dispatch({ type: "VALID" });
    } else {
      dispatch({ type: "INVALID" });
    }
  }, [state.username, state.password]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    dispatch({ type: "FETCH_START" });
    try {
      const formData = Object.fromEntries(new FormData(e.target));
      const response = await fetch("http://localhost:8443/user/create", {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.messages[0] || "Account creation failed");
      }

      setForm("login");
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Unexpected Error",
      });
    } finally {
      dispatch({ type: "FETCH_END" });
    }
  }

  function handleTextChange(e) {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { name: e.target.name, value: e.target.value },
    });
  }

  function googleSignIn() {
    window.location.href = "http://localhost:8443/oauth2/authorization/google"
  }

  return (
    <div className={style.authFormContainer}>
      <div className={style.form_container}>
        <form onSubmit={(e) => handleFormSubmit(e)} className={style.authForm}>
          <h1>Create Account</h1>

          <input
            onChange={(e) => handleTextChange(e)}
            className={style.input}
            type="text"
            id="username"
            name="username"
            placeholder="username"
            max="20"
          />

          <input
            onChange={(e) => handleTextChange(e)}
            className={style.input}
            type="text"
            id="password"
            name="password"
            placeholder="password"
            max="20"
          />

          <Button
            loading={state.loading}
            text="Create"
            clickable={state.isValid}
            isSubmit={true}
          />
          <Button
            text="Log in"
            onClick={() => setForm("login")}
            clickable={true}
          />
        </form>
      </div>
      <div className={style.or}>
        <div></div>
        or
        <div></div>
      </div>
      <div className={style.googleButton} onClick={googleSignIn}>
        <img src="/svg/google.svg"></img>Sign in with Google
      </div>
    </div>
  );
}

export default CreateAccount;
