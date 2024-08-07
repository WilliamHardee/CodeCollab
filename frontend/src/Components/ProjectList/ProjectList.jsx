import React, { useRef } from "react";
import { useState, useEffect, useMemo } from "react";
import session from "../../Session";
import { useNavigate } from "react-router";
import ProjectCard from "./ProjectCard";
import style from "../../Styles/projectList.module.css";
import Button from "../Global/Button";
import CreateProjectModal from "./CreateProjectModal";
import { CSSTransition } from "react-transition-group";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const projectRefs = useMemo(
    () =>
      Array(projects.length)
        .fill()
        .map(() => React.createRef()),
    [projects.length]
  );

  function logout() {
    sessionStorage.clear()
    fetch('https://localhost:8443/user/logout', {method: "POST", credentials: "include" })
    navigate("/")
  }

  function getProjects() {
    const username = session.getSession("username");
    if (!username) {
      navigate("/");
    }

    fetch(`https://localhost:8443/project/${username}`,
      {credentials: "include"}
    )
      .then((res) => res.json())
      .then((res) => {
        setProjects(res.projects);
        console.log("fetching");
        console.log(res.projects)
      })
      .catch((err) => console.log("An unexpected error happened: " + err));
  }

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    setVisibleProjects(projects.map(() => true));
  }, [projects]);

  function onModalExit() {
    setModal(false);
    getProjects();
  }

  async function onDelete(e, projectId, i) {
    e.stopPropagation();
    setVisibleProjects(prev => {
      const newVisible = [...prev];
      newVisible[i] = false;
      return newVisible;
    });
    await new Promise((res) => setTimeout(() => {
      fetch(
        `https://localhost:8443/user/deleteProject/${session.getSession(
          "username"
        )}/${projectId}`,
        { method: "DELETE" ,
          credentials: "include"
        }
      )
        .catch((err) => console.log("unexpected error occured" + err));
    }, 300));

  }

  return (
    <div className={style.wrapper}>
      <div className={style.menu}>
        <Button
              text="Create Project"
              clickable={true}
              onClick={() => setModal(true)}
            />
        <div className={style.inviteContainer}>
          <h2>Invites</h2>
          <div className={style.inviteMenu}>

          </div>
        </div>
        <div className={style.logout}>
          <Button text="Logout" clickable={true} onClick={logout}/>
        </div>
       
      </div>
      <div className={style.container}>
        <h1>P R O J E C T S</h1>
        <div className={style.project_list_container}>
          {projects.map((project, i) => (
            <CSSTransition
              nodeRef={projectRefs[i]}
              in={visibleProjects[i]}
              timeout={200}
              classNames={{
                enter: style.cardEnter,
                enterActive: style.cardEnterActive,
                exit: style.cardExit,
                exitActive: style.cardExitActive,
              }}
              unmountOnExit
            >
              <div ref={projectRefs[i]}>
                <ProjectCard index={i} project={project} onDelete={onDelete} />
              </div>
            </CSSTransition>
          ))}
          
        </div>
      </div>
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
          <CreateProjectModal onRemove={onModalExit} />
        </div>
      </CSSTransition>
    </div>
  );
}

export default ProjectList;
