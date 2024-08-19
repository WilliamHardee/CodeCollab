import React from "react";
import style from "../../Styles/codewindow.module.css";
import Button from "../Global/Button";
import { useNavigate } from "react-router";
const CodeNavbar = ({loading, onRun, setModal }) => {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.clear()
    fetch('http://localhost:8443/user/logout', {method: "POST", credentials: "include" })
    navigate("/")
  }
 
  return (
    <div className={style.nav}>
      <h1 onClick={() => navigate("/projectList")}>Home</h1>
      <div className={style.navItem} onClick={setModal}>
      <img className={style.svg} src="/svg/invite.svg"></img> Invite
      </div>
      <div className={`${style.navItem}  ${style.runButton}`} onClick={onRun}>
        {loading ? <div className={style.loader}></div> : <img className={style.svg} src="/svg/play.svg"></img>} Run
      </div>
      <div className={style.logout} onClick={logout}>
      <img className={style.svg} src="/svg/logOut.svg"></img>
        Sign Out
      </div>
    </div>
  );
};

export default CodeNavbar;
