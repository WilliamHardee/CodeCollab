

import React, { useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";
import { languageIconsMap } from "../../Data";
import InviteModal from "./InviteModal";
import Editor from "./Editor";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { createClient } from "@liveblocks/client";



function CodeWindow() {
  const { id } = useParams();
  const [initialCode, setInitialCode] = useState("");
  const [code, setCode] = useState("");
  const [project, setProject] = useState(null);
  const [modal, setModal] = useState(false);
  const [webContainerInstance, setWebContainerInstance] = useState(null);
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null);

  async function run() {
    if(!webContainerInstance) {
      return;
    }
    const data = languageIconsMap[project.language];
    console.log(data);

    const fileName = "Main" + data.extension;
    const outputFileName = "Main";
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
    setCode("")
    fetch(`https://localhost:8443/project/getProject/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          setProject(res.project);
          setInitialCode(res.project.projectData);
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
          console.error("Error tearing down webcontainer");
        });
        setWebContainerInstance(null);
      }
    };
  }, []); 

  return (
    <>
      <CodeNavbar onRun={run} setModal={() => setModal(!modal)}/>
      <div className={style.ide}>
        <LiveblocksProvider publicApiKey={"pk_prod_XrfW_yUzfEcFyy5aov1mI2FcnANGtz_lQT7L_Uf3UMGYHbOyvHAfsgoltgd4xkcY"}>
          <RoomProvider id = {id} initialStorage={{code: initialCode}}>
            <ClientSideSuspense fallback={<div>Loading...</div>}>
              <Editor code={code} setCode={setCode} />
            </ClientSideSuspense>
  
          </RoomProvider>
        </LiveblocksProvider>
        <iframe ref={iframeRef} title="output"></iframe>
      </div>
      {modal && <InviteModal projectId={id}/>}
    </>
  );
}

export default CodeWindow;