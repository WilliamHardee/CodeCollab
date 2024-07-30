import React, { useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import { Stomp, Client } from "@stomp/stompjs";
import SockJs from "sockjs-client";
import session from "../../Session";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {basicSetup} from 'codemirror'
import {coolGlow} from 'thememirror'

function CodeWindow() {
  const { id } = useParams();
  const [stompClient, setStompClient] = useState();
  const [code, setCode] = useState("");
  const [connected, setConnect] = useState(false);
  const [project, setProject] = useState(null);
  const [webContainerInstance, setWebContainerInstance] = useState(null);
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null);
  const codeMirrorRef = useRef(null)

  async function run() {
    const files = {
      "main.py": {
        file: {
          contents: code,
        },
      },
    };

    await webContainerInstance.mount(files);
    const main = await webContainerInstance.fs.readFile("main.py", "utf-8");
    console.log(main);
    await webContainerInstance.spawn("apt-get", ["install", "python3.6"]);
    const process = await webContainerInstance.spawn("python3", ["main.py"]);

    let result = "";
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          result += data;
          iframeRef.current.contentWindow.document.body.innerHTML = result;
        },
      })
    );
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
        projectData: code,
      }),
    })
      .then((response) => {
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
          setCode(res.project.projectData);
        }
      })
      .catch((err) => {
        console.log("An unexpected error occured: " + err);
      });
  }


  useEffect(() => {
    if (project) {
      saveProject();
    }
  }, [code]);

  useEffect(() => {
    let startState = EditorState.create({
      doc: code,
      extensions: [basicSetup, coolGlow],
    })

    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#editorContainer")
    })

    return() => view.destroy()
  })
  useEffect(() => {
    async function bootWebContainer() {
      if (!initializationAttempted.current) {
        initializationAttempted.current = true;
        try {
          const instance = await WebContainer.boot();
          setWebContainerInstance(instance);
        } catch (error) {
          console.error("Error booting WebContainer", error);
        }
      }
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = `<html><body style=${"color:white; font-size: 2rem;"}><code></code></body></html>`;
    }

    getProjectDetails();
    bootWebContainer();
  }, []);

  


  return (
    <>
      <CodeNavbar onRun={run} />
      <div className={style.ide}>
        <div id="editorContainer" className={style.editorContainer}>
        </div>

        <iframe ref={iframeRef} titel="output"></iframe>
      </div>
    </>
  );
}

export default CodeWindow;
