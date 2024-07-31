import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { coolGlow } from "thememirror";
import { yCollab } from "y-codemirror.next";
import { languageIconsMap } from "../../Data";

function CodeWindow() {
  const { id } = useParams();
  const [stompClient, setStompClient] = useState();
  const [code, setCode] = useState("");
  const [connected, setConnect] = useState(false);
  const [project, setProject] = useState(null);
  const [webContainerInstance, setWebContainerInstance] = useState(null);
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null);

  const ydocRef = useRef(null);
  const providerRef = useRef(null);


  async function run() {
    if(!webContainerInstance) {
      return
    }
    const data = languageIconsMap[project.language];
    console.log(data);

    
    const fileName = "Main" + data.extension
    const outputFileName = "Main"
    const files = {
      [fileName]: {
        file: {
          contents: code,
        },
      },
    };

    data.install.forEach(async (ins) => {
      const array = ins.split(" ");
      await webContainerInstance.spawn(array[0], [...array.slice(1)]);
    });

    if(data.compile) {
      const compileCommand = data.compile[0];
      const compileArgs = [...data.compile.slice(1), fileName, outputFileName];
      await webContainerInstance.spawn(compileCommand, compileArgs);
    }

    const runArgs = data.compile ? [outputFileName] : [fileName];
    await webContainerInstance.mount(files);
    const process = await webContainerInstance.spawn(data.run[0], [...data.run.slice(1),...runArgs]);
  
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
    fetch("https://localhost:8443/project/save", {
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
    fetch(`https://localhost:8443/project/getProject/${id}`, {
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
    if (!ydocRef.current) {
      ydocRef.current = new Y.Doc();
    }

    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(
        "codemirror6demo",
        ydocRef.current
      );
    }

    const ytext = ydocRef.current.getText("codemirror");

    let startState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        coolGlow,
        yCollab(ytext, providerRef.current.awareness),

      ],
    });
    console.log(providerRef.current.awareness);
    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#editorContainer"),
      dispatch: (tr) => {
        view.update([tr]);
        if (tr.docChanged) {
          setCode(view.state.doc.toString());
        }
      },
    }, []);

    

    providerRef.current.on("synced", (isSynced) => {
      console.log("Synced:", isSynced);
    });

    ytext.observe(() => {
      console.log("Document updated:", ytext.toString());
    });

    return () => {
      view.destroy();
      providerRef.current.destroy();
      ydocRef.current.destroy();
    };
  });
  
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
      iframeRef.current.srcdoc = `<html><body style="color:white; font-size: 1rem;"><code></code></body></html>`;
    }
  

    getProjectDetails();
    bootWebContainer();
  

    return () => {
      if (webContainerInstance) {
        webContainerInstance.teardown()
      }
    };
  }, [webContainerInstance]); 

  return (
    <>
      <CodeNavbar onRun={run} />
      <div className={style.ide}>
        <div id="editorContainer" className={style.editorContainer}></div>

        <iframe ref={iframeRef} titel="output"></iframe>
      </div>
    </>
  );
}

export default CodeWindow;
