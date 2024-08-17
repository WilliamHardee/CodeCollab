import React, { useEffect, useReducer, useRef } from "react";
//import style from "../../Styles/projectList.module.css";
import style from "../../Styles/modals.module.css"
import Button from "../Global/Button";
import { languageIconsMap } from "../../Data";
import session from "../../Session";
import { formReducer, createProjectInitialState } from "../Global/formReducer";
import IOMessage from "../Global/IOMessage";
import { CSSTransition } from "react-transition-group";

function CreateProjectModal({ onModalExit, modal }) {
  const [state, dispatch] = useReducer(formReducer, createProjectInitialState);
  const modalRef = useRef(null);
  useEffect(() => {
    if (!state.language || !state.projectName) {
      dispatch({ type: "INVALID" });
    } else {
      dispatch({ type: "VALID" });
    }
  }, [state.projectName, state.language]);

  async function handleSubmit() {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await fetch("https://localhost:8443/project", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: state.projectName,
          projectData: "",
          language: state.language,
          username: session.getSession("username"),
        }),
      });

      if (response.status != 201) {
        const errorData = await response.json();
        throw new Error(errorData.message[0] || "Error creating project");
      }
      onModalExit();
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Unexpected Error",
      });
    } finally {
      dispatch({ type: "FETCH_END" });
    }
  }

  function handleTextChange(name, value) {
    dispatch({ type: "UPDATE_FIELD", payload: { name: name, value: value } });
  }

  return (
    <CSSTransition
      nodeRef={modalRef}
      in={modal}
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
        <div className={style.outsideModal} onClick={() => onModalExit()}></div>
        <div className={style.modalContainer}>
          <div className={style.projectModal}>
            <h1>Select Language</h1>
            <div className={style.iconContainer}>
              {Object.entries(languageIconsMap).map(([key, value]) => (
                <div
                  key={key}
                  name="language"
                  className={`${style.projectIcon} ${
                    key == state.language ? style.selectedCell : null
                  }`}
                  onClick={() => handleTextChange("language", key)}
                >
                  <img src={value.icon}></img>
                </div>
              ))}
            </div>
            <div className={style.modalTextarea}>
              <textarea
                name="projectName"
                onChange={(e) =>
                  handleTextChange("projectName", e.target.value)
                }
                placeholder="Project Name"
                rows="1"
              ></textarea>
            </div>

            <div className={style.modalButton}>
              <Button
                loading={state.loading}
                text="create"
                clickable={state.isValid}
                onClick={handleSubmit}
              />
            </div>
            <div className={style.exitButton} onClick={onModalExit}>
              <img src="/svg/exit.svg"></img>
            </div>
          </div>
          <IOMessage message={state.errorMsg} error={state.error} />
        </div>
      </div>
    </CSSTransition>
  );
}

export default CreateProjectModal;
