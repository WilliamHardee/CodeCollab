import React, { useRef } from "react";
import { useState, useEffect, useMemo } from "react";
import session from "../../Session";
import { useNavigate } from "react-router";
import ProjectCard from "./ProjectCard";
import style from "../../Styles/projectList.module.css";
import Button from "../Global/Button";
import CreateProjectModal from "../Modals/CreateProjectModal";
import { CSSTransition } from "react-transition-group";
import SideMenu from "./SideMenu";
import InviteModal from "../Modals/InviteModal";


function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("")
  
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const projectRefs = useMemo(
    () =>
      Array(projects.length)
        .fill()
        .map(() => React.createRef()),
    [projects.length]
  );

  async function fetchUsername() {
    try {
      const response = await fetch("http://localhost:8443/user", {credentials: "include"})
      if(response.status != 200) {
        console.log(response.status)
        navigate("/")
        return
      }
      const jsonRes = await response.json()
      session.setSession("username", jsonRes.username)
    }
    catch (e) {
      console.error("An unexpected error occured", e)
      navigate("/")
    }
  }



  function getProjects() {
    const username = session.getSession("username");

    fetch(`http://localhost:8443/project`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setProjects(res.projects);
      })
      .catch((err) => console.log("An unexpected error happened: " + err));
  }

  
  useEffect(() => {
    getProjects();
    fetchUsername();
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
    setVisibleProjects((prev) => {
      const newVisible = [...prev];
      newVisible[i] = false;
      return newVisible;
    });
    await new Promise((res) =>
      setTimeout(() => {
        fetch(
          `http://localhost:8443/user/deleteProject/${session.getSession(
            "username"
          )}/${projectId}`,
          { method: "DELETE", credentials: "include" }
        ).catch((err) => console.log("unexpected error occured" + err));
      }, 300)
    );
  }

  return (
    <div className={style.wrapper}>
      <SideMenu setModal={setModal}/>
      
       
      <div className={style.container}>
        <h1>P R O J E C T S</h1>
        <div className={style.project_list_container}>
          {projects.map((project, i) => (
            <CSSTransition 
              key={i}
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
                <ProjectCard index={i} project={project} onDelete={onDelete} setInviteModal={setInviteModal} setSelectedId={setSelectedId}/>
              </div>
            </CSSTransition>
          ))}
        </div>
      </div>
        <CreateProjectModal modal={modal} onModalExit={onModalExit} />
        <InviteModal inviteModal={inviteModal} setInviteModal={setInviteModal} projectId={selectedId}/>
    </div>
  );
}

export default ProjectList;
