import React, { useEffect, useState } from "react";
import style from "../../Styles/projectList.module.css";
import { Link, useNavigate } from "react-router-dom";
import { languageIconsMap } from "../../Data";

function ProjectCard({ index, project, onDelete, setInviteModal, setSelectedId }) {
  const navigate = useNavigate();
  function handleInviteClick(e) {
    e.stopPropagation()
    setSelectedId(project.id)
    setInviteModal(true)
  }
  return (

    <div
      className={style.project_card}
      onClick={() => navigate(`/CodeWindow/${project.id}`)}
    >
      <div className={style.icon}>
        <img src={languageIconsMap[project.language].icon}></img>
      </div>

      <h2> {project.projectName} </h2>
      <div className={style.inviteIcon} onClick={(e) => handleInviteClick(e)}>
        Invite
      </div>
      <div className={style.subicon} onClick={(e) => onDelete(e, project.id, index)}>
        <img src="/svg/trashcan.svg"></img>
      </div>
    </div>

  );
}

export default ProjectCard;
