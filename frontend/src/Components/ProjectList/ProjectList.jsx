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

  function getProjects() {
    const username = session.getSession("username");
    if (!username) {
      navigate("/Login");
    }

    fetch(`http://localhost:8080/project/${username}`)
      .then((res) => res.json())
      .then((res) => {
        setProjects(res.projects);
        console.log("fetching");
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
        `http://localhost:8080/user/deleteProject/${session.getSession(
          "username"
        )}/${projectId}`,
        { method: "DELETE" }
      )
        .catch((err) => console.log("unexpected error occured" + err));
    }, 300));

  }

  return (
    <div>
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
          <Button
            text="Create Project"
            clickable={true}
            onClick={() => setModal(true)}
          />
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
