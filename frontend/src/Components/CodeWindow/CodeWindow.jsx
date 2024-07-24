import React, { useEffect, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { Stomp, Client } from "@stomp/stompjs";
import SockJs from "sockjs-client";
import session from "../../Session";
import CodeNavbar from "./CodeNavbar";

function CodeWindow() {
  const { id } = useParams();
  const [stompClient, setStompClient] = useState();
  const [updates, setUpdates] = useState("");
  const [connected, setConnect] = useState();
  const [project, setProject] = useState(null);

  function connect() {
    const socket = new SockJs("http://localhost:8080/connectToProject");
    const tempstompClient = Stomp.over(socket);
    tempstompClient.debug = function () {};
    tempstompClient.connect({}, function (frame) {
      setConnect(true);
      setStompClient(tempstompClient);
      console.log("Connected");
      tempstompClient.subscribe(`/topic/project/${id}`, (message) => {
        const res = JSON.parse(message.body);
        if (res.from !== session.getSession("username")) {
          console.log(res);
          setUpdates(res.content);
        }
      });
    });
  }

  function saveProject() {

    fetch("http://localhost:8080/project/save", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: id,
        projectData: updates,
      }),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(
              `HTTP error! status: ${response.status}, body: ${text}`
            );
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function getProjectDetails() {
    fetch(`http://localhost:8080/project/getProject/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          setProject(res.project);
          setUpdates(res.project.projectData);
        }
      })
      .catch((err) => {
        console.log("An unexpected error occured: " + err);
      });
  }

  function sendMessage() {
    stompClient.send(
      `/chat/connect/${id}`,
      {},
      JSON.stringify({ from: session.getSession("username"), content: updates })
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      //sendMessage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(project) {
      saveProject()
    }
  }, [updates]);
  useEffect(() => {
    getProjectDetails();
  }, []);

  function onChange(value) {
    setUpdates(value);
  }

  return (
    <>
      <CodeNavbar />
      <div className={style.editorContainer} updates={updates} projectId={id}>
        <Editor val={updates} onChange={onChange} />
      </div>
    </>
  );
}

export default CodeWindow;
