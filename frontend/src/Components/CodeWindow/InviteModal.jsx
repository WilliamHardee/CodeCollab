import {React, useState} from 'react'
import style from "../../Styles/codewindow.module.css"
import Button from '../Global/Button'
import session from '../../Session'
import IOMessage from '../Global/IOMessage'
function InviteModal({projectId}) {
    const [username, setUsername] = useState("")
    const [errorMsg, setErrorMsg] = useState(null)

    async function handleSubmit() {
        try {
            const response = await fetch("https://localhost:8443/invitation/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inviter_username: session.getSession("username"),
                    invited_username: username,
                    project_id: projectId
                }) 
            })

            if(response.status != 201) {
                const json = await response.json()
                setErrorMsg(json.messages[0])
            }
            else {
                setErrorMsg(null)
            }

        } catch( err ) {
            console.error("An unexpected error occured")
        }
    }
  return (
    <>
    <div className={style.inviteModal}>
        <h1 className={style.modalTitle}>Invite a new Collaborator</h1>
        <div className={style.modalTextarea}>
            <textarea  onChange={(e) => setUsername(e.target.value)}placeholder="Username" rows="1"></textarea>
        </div>
        <Button text="invite" clickable={true} onClick={handleSubmit}/>
        {errorMsg && <IOMessage message={errorMsg} error={true}/>}
    </div>
    
    </>
  )
}

export default InviteModal