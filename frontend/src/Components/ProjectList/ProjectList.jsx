import React from 'react'
import { useState, useEffect } from 'react'
import session from '../../Session'
import { useNavigate } from 'react-router'
import ProjectCard from './ProjectCard'
import style from '../../Styles/projectList.module.css'
import Button from '../Global/Button'

function ProjectList() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const username = session.getSession("username")
    if(!username) {
      navigate("/Login")
    }

    fetch(`http://localhost:8080/project/${username}`)
    .then((res) => res.json())
    .then((res) => {
      setProjects(res.projects)
    })
    .catch((err) => console.log("An unexpected error happened: " + err))

  }, [])

  function onRemove(proj) {

  }

  return (
    <div className={style.container}>
      <h1>Select a Project</h1>
      <div className={style.project_list_container}>
        {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onRemove={onRemove}/>
        ))}
        <Button text="Create Project" clickable={true} />
      </div>
    </div>

 
  )
}

export default ProjectList