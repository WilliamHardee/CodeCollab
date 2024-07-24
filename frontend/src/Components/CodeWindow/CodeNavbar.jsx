import React from "react";
import style from "../../Styles/codewindow.module.css";
import Button from "../Global/Button";
import { useNavigate } from "react-router";

const CodeNavbar = ({ projectId, updates, onRun }) => {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.clear()
    fetch('http://localhost:8080/user/logout', {method: "POST", credentials: "include" })
    navigate("/")
  }
 
  return (
    <div className={style.nav}>
      <h1 onClick={() => navigate("/projectList")}>Project List</h1>
      <div className={style.navItem}>
        <Button text="Run" clickable={true} onClick={onRun}/>
      </div>
      <div className={style.navItem}>
        <Button text="Invite" clickable={true} />
      </div>
      <div className={style.logout}>
        <Button text="Logout" clickable={true} onClick={logout}/>
      </div>
    </div>
  );
};

export default CodeNavbar;
