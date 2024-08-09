import React, { useEffect, useState } from 'react'
import style from "../../Styles/projectList.module.css"
import Button from '../Global/Button'
import session from '../../Session';
import { useNavigate } from 'react-router';
function SideMenu({setModal}) {
    const [invitations, setInvitations] = useState(null);
    const navigate = useNavigate();
    function logout() {
        sessionStorage.clear();
        fetch("https://localhost:8443/user/logout", {
          method: "POST",
          credentials: "include",
        });
        navigate("/");
      }
      async function getInvites() {
        try {
          const response = await fetch(
            `https://localhost:8443/invitation/${session.getSession("username")}`,
            { credentials: "include" }
          );
          if (response.status != 200) {
            throw new Error("Could not fetch invites");
          }
    
          const jsonRes = await response.json();
          setInvitations(jsonRes.invitations);
        } catch (err) {
          console.error("Unexpected error occured", err);
        }
      }

      useEffect(() => getInvites, [invitations])

  return (
    <div className={style.menu}>
        <Button
          text="Create Project"
          clickable={true}
          onClick={() => setModal(true)}
        />
        <div className={style.inviteContainer}>
          <h2>Invites</h2>
          <div className={style.inviteMenu}>
            {invitations && invitations.length > 0 ? (
              invitations.map((invite) => (
                <div key={invite.project_id} className={style.inviteCard}>
                  <h2>{invite.project_name}</h2>
                  <p>{invite.inviter_username}</p>
                  <div className={style.buttonContainer}>
                    <button className={style.acceptButton}>Accept</button>
                    <button className={style.rejectButton}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <div>No invites available</div>
            )}
          </div>
        </div>
        <div className={style.logout}>
          <Button text="Logout" clickable={true} onClick={logout} />
        </div>
      </div>
  )
}

export default SideMenu