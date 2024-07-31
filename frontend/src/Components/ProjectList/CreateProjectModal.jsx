import React, { useEffect, useState } from "react";
import style from "../../Styles/projectList.module.css";
import Button from "../Global/Button";
import { languageIconsMap } from "../../Data";
import session from "../../Session";

function CreateProjectModal({onRemove}) {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("")
  const [submittable, setSubmittable] = useState(false)

  useEffect(() => {
    if(selected == null || !name) {
        setSubmittable(false)
    }
    else {
        setSubmittable(true)
    }
  }, [name, selected])

  function handleSubmit() {
    fetch("https://localhost:8443/project", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectName: name,
            projectData: "",
            language: selected,
            username: session.getSession("username")
        })
    }).then(() => {
        onRemove()
        console.log("created")
    })
  }


  return (
    <div className={style.projectModal}>
      <h1>Select Language</h1>
      <div className={style.iconContainer}>
        {Object.entries(languageIconsMap).map(([key, value]) => (
          <div
            key={key}
            className={`${style.projectIcon} ${
              key == selected ? style.selectedCell : null
            }`}
            onClick={() => setSelected(key)}
          >
            <img src={value.icon}></img>
          </div>
        ))}
      </div>
      <div className={style.modalTextarea}>
        <textarea onChange={(e) => setName(e.target.value) } placeholder="Project Name" rows="1"></textarea>
      </div>

      <div className={style.modalButton}>
        <Button text="create" clickable={submittable} onClick={handleSubmit}/>
      </div>
      <div className={style.exitButton} onClick={onRemove}>
        <img src="/svg/exit.svg"></img>
      </div>
    </div>
  );
}

export default CreateProjectModal;
