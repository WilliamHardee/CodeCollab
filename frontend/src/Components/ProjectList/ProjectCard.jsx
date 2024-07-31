import React, { useEffect, useState } from "react";
import style from "../../Styles/projectList.module.css";
import { Link, useNavigate } from "react-router-dom";
import { languageIconsMap } from "../../Data";

function ProjectCard({ index, project, onDelete }) {
  const navigate = useNavigate();
  const [icon, setIcon] = useState("");

  useEffect(() => {
    setIcon(languageIconsMap[project.language].icon);
  }, []);

  return (

    <div
      className={style.project_card}
      onClick={() => navigate(`/CodeWindow/${project.id}`)}
    >
      <div className={style.icon}>
        <img src={icon}></img>
      </div>

      <h2> {project.projectName} </h2>

      <div className={style.subicon} onClick={(e) => onDelete(e, project.id, index)}>
        <img src="/svg/trashcan.svg"></img>
      </div>
    </div>

  );
}

export default ProjectCard;
