import React, { useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { Stomp, Client } from "@stomp/stompjs";
import SockJs from "sockjs-client";
import session from "../../Session";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";



function CodeWindow() {
  const { id } = useParams();
  const [stompClient, setStompClient] = useState();
  const [updates, setUpdates] = useState("");
  const [connected, setConnect] = useState(false);
  const [project, setProject] = useState(null);
  const [webContainerInstance, setWebContainerInstance] = useState(null)
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null)


  async function run() {
    const files = {
      'main.py': {
        file: {
          contents: updates
        }
      }
    }

    await webContainerInstance.mount(files)
    const main = await webContainerInstance.fs.readFile('main.py', 'utf-8');
    console.log(main);
    await webContainerInstance.spawn('apt-get', ['install', 'python3.6'])
    const process = await webContainerInstance.spawn('python3', ['main.py']);

    let result = ""
    process.output.pipeTo(new WritableStream({
      write(data) {
        result += data
        iframeRef.current.contentWindow.document.body.innerHTML = result
      }
    }))


  }

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
    if (project) {
      saveProject();
    }
  }, [updates]);

  useEffect(() => {
    async function bootWebContainer() {
      if (!initializationAttempted.current) {
        initializationAttempted.current = true;
        try {
          const instance = await WebContainer.boot();
          setWebContainerInstance(instance)
        } catch (error) {
          console.error("Error booting WebContainer", error);
        }
      }
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = `<html><body style=${"color:white; font-size: 2rem;"}></body></html>`;
    }

    getProjectDetails();
    bootWebContainer();
  }, []);

  function onChange(value) {
    setUpdates(value);
  }

  return (
    <>
      <CodeNavbar onRun={run}/>
      <div className={style.ide}>
        <div className={style.editorContainer}>
          <Editor val={updates} onChange={onChange} />
        </div>

        <iframe ref={iframeRef} titel="output"></iframe>
      </div>
    </>
  );
}

export default CodeWindow;
