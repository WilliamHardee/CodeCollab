import { React, useState, useRef } from "react";
//import style from "../../Styles/codewindow.module.css"
import style from "../../Styles/modals.module.css";
import Button from "../Global/Button";
import session from "../../Session";
import IOMessage from "../Global/IOMessage";
import { CSSTransition } from "react-transition-group";
function InviteModal({ projectId, inviteModal, setInviteModal }) {
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const modalRef = useRef(null);

  async function handleSubmit() {
    try {
      const response = await fetch("https://localhost:8443/invitation/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviter_username: session.getSession("username"),
          invited_username: username,
          project_id: projectId,
        }),
      });

      if (response.status != 201) {
        const json = await response.json();
        setErrorMsg(json.messages[0]);
      } else {
        setErrorMsg(null);
        setInviteModal(false);
      }
    } catch (err) {
      console.error("An unexpected error occured");
    }
  }
  return (
    <CSSTransition
      nodeRef={modalRef}
      in={inviteModal}
      timeout={200}
      classNames={{
        enter: style.modalEnter,
        enterActive: style.modalEnterActive,
        exit: style.modalExit,
        exitActive: style.modalExitActive,
      }}
      unmountOnExit
    >
      <div ref={modalRef}>
        <div
          className={style.outsideModal}
          onClick={() => setInviteModal(false)}
        ></div>
        <div className={style.inviteModal}>
          <h1 className={style.modalTitle}>Invite a new Collaborator</h1>
          <div className={style.modalTextarea}>
            <textarea
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              rows="1"
            ></textarea>
          </div>
          <Button text="invite" clickable={true} onClick={handleSubmit} />
          {errorMsg && <IOMessage message={errorMsg} error={true} />}
          <div
            className={style.exitButton}
            onClick={() => setInviteModal(false)}
          >
            <img src="/svg/exit.svg"></img>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

export default InviteModal;
