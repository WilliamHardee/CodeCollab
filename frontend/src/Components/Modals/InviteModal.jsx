import { React, useState, useRef, useReducer, useEffect } from "react";
//import style from "../../Styles/codewindow.module.css"
import style from "../../Styles/modals.module.css";
import Button from "../Global/Button";
import session from "../../Session";
import IOMessage from "../Global/IOMessage";
import { CSSTransition } from "react-transition-group";
import { inviteModalInitialState, formReducer } from "../Global/formReducer";
function InviteModal({ projectId, inviteModal, setInviteModal }) {
  const [state, dispatch] = useReducer(formReducer, inviteModalInitialState)
  const modalRef = useRef(null);

  async function handleSubmit() {
    dispatch({type: "FETCH_START"})
    try {
      const response = await fetch("http://localhost:8443/invitation/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviter_username: session.getSession("username"),
          invited_username: state.username,
          project_id: projectId,
        }),
      });

      if (response.status != 201) {
        const json = await response.json();
        throw new Error(json.messages[0] || "Error inviting user");
      } 
      setInviteModal(false);
      
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Unexpected Error",
      });
    }
    finally {
      dispatch({type: "FETCH_END"})
    }
  }

  function handleTextChange(name, value) {
    dispatch({ type: "UPDATE_FIELD", payload: { name: name, value: value } });
  }

  useEffect(() => dispatch({type: "CLEAR_ERROR"}),[inviteModal])

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
              onChange={(e) => handleTextChange("username", e.target.value)}
              placeholder="Username"
              rows="1"
            ></textarea>
          </div>
          <Button loading={state.loading} text="invite" clickable={true} onClick={handleSubmit} />
          {state.errorMsg && <IOMessage message={state.errorMsg} error={state.error} />}
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
