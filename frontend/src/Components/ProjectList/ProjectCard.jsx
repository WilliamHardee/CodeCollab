import React from 'react'
import style from '../../Styles/projectList.module.css'
import { Link } from 'react-router-dom'

function ProjectCard({project, onRemove}) {
  return (
    <div className={style.project_card}>
        <Link to={`/CodeWindow/${project.id}`}>
            {project.projectName}
        </Link>
 
    </div>
        

  )
}

export default ProjectCard