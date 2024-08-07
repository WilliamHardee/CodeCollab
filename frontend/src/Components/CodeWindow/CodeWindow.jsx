import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { coolGlow } from "thememirror";
import { languageIconsMap } from "../../Data";
import InviteModal from "./InviteModal";

function CodeWindow() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [project, setProject] = useState(null);
  const [modal, setModal] = useState(false)
  const [webContainerInstance, setWebContainerInstance] = useState(null);
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null);
  const viewRef = useRef(null)


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

    if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code
        }
      })
    }
  }, [code]);

  useEffect(() => {
    


    let startState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        coolGlow,

      ],
    });

    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#editorContainer"),
      dispatch: (tr) => {
        view.update([tr]);
        if (tr.docChanged) {
          setCode(view.state.doc.toString());
        }
      },
    });

    viewRef.current = view

   

    return () => {
      view.destroy();
    };
  }, []);
  
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
        webContainerInstance.teardown().catch(err => {
          console.error("Error tearing down webcontainer")
        })
        setWebContainerInstance(null)
      }
    };
  }, []); 

  return (
    <>
      <CodeNavbar onRun={run} setModal={() => setModal(!modal)}/>
      <div className={style.ide}>
        <div id="editorContainer" className={style.editorContainer}></div>
        <iframe ref={iframeRef} titel="output"></iframe>
      </div>
      {modal && <InviteModal projectId={id}/>}
    </>
  );
}

export default CodeWindow;
