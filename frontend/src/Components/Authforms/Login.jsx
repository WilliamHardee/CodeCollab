import React, { useState, useEffect } from "react";
import style from "../../Styles/authforms.module.css";
import TitleCard from "../Global/TitleCard";
import Message from "./Message";
import session from "../../Session";
import { redirect, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Button from "../Global/Button";

function Login({ setForm, setFormStatus }) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [submittable, setSubmittable] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (
      userName.length >= 5 &&
      userName.length <= 25 &&
      password.length >= 5 &&
      password.length <= 25
    ) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  }, [userName, password]);

  function handleFormSubmit(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    fetch("https://localhost:8443/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          session.setSession("username", formData.username);
          navigate("/ProjectList");
        } else {
          e.target.reset();
          setUsername("");
          setPassword("");
          setFormStatus([res.messages[0], true]);
          setSubmittable(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setFormStatus(["Unexpected error occured please try again", true]);
        setSubmittable(false);
      });
  }

  function switchForm() {
    setForm("create");
    setFormStatus(["", true]);
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} className={style.authForm}>
        <h1>Log In</h1>

        <input
          onChange={(e) => setUsername(e.target.value)}
          className={style.input}
          type="text"
          id="username"
          name="username"
          placeholder="username"
          max="25"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          className={style.input}
          type="password"
          id="password"
          name="password"
          placeholder="password"
          max="25"
        />

        <Button text="Log In" clickable={submittable} isSubmit={true} />
        <Button
          text="Create Account"
          onClick={() => switchForm()}
          clickable={true}
        />
      </form>
    </>
  );
}

export default Login;
