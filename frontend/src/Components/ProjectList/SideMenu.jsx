import React, { useEffect, useState } from "react";
import style from "../../Styles/projectList.module.css";
import Button from "../Global/Button";
import session from "../../Session";
import { useNavigate } from "react-router";
function SideMenu({ setModal }) {
  const [invitations, setInvitations] = useState(null);
  const navigate = useNavigate();
  function logout() {
    sessionStorage.clear();
    fetch("http://localhost:8443/user/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  }
  async function getInvites() {
    try {
      const response = await fetch(
        `http://localhost:8443/invitation`,
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

  async function acceptInvite(id) {
    try {
    const response = await fetch(`http://localhost:8443/invitation/accept/${id}`, {
      credentials: "include",
      method: "POST"
    });

    if(response.status != 201) {
      throw Error("Could not accept projects")
    }

    getInvites()

    } catch (error) {
      console.error("An unexpected error occured when accepting project", error)
    }

  }

  async function rejectInvite(id, inviter) {
    try {
      const response = await fetch("http://localhost:8443/invitation/delete", {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inviter,
          project_id: id,
        }),
      });

      if(response.status != 204) {
        throw Error("Could not reject invite")
      }

      getInvites()

    } catch (error) {
      console.error("An unexpected error occured when rejecting invite", error)
    }

  }


  useEffect(() => {getInvites()}, []);

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
                  <button onClick={() => acceptInvite(invite.project_id)} className={style.acceptButton}>Accept</button>
                  <button onClick={() => rejectInvite(invite.project_id, invite.inviter_username)} className={style.rejectButton}>Reject</button>
                </div>
              </div>
            ))
          ) : (
            <h2>No Invites Available</h2>
          )}
        </div>
      </div>
      <div className={style.logout}>
        <Button text="Logout" clickable={true} onClick={logout} />
      </div>
    </div>
  );
}

export default SideMenu;
