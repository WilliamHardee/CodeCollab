import React, { useEffect, useRef, useState } from "react";
import style from "../../Styles/codewindow.module.css";
import { useParams } from "react-router-dom";
import CodeNavbar from "./CodeNavbar";
import { WebContainer } from "@webcontainer/api";
import { languageIconsMap } from "../../Data";
import InviteModal from "../Modals/InviteModal";
import Editor from "./Editor";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { createClient } from "@liveblocks/client";

function CodeWindow() {
  const { id } = useParams();
  const [initialCode, setInitialCode] = useState("");
  const [code, setCode] = useState("");
  const [project, setProject] = useState(null);
  const [modal, setModal] = useState(false);
  const [runLoading, setrunLoading] = useState(false)
  const [webContainerInstance, setWebContainerInstance] = useState(null);
  const initializationAttempted = useRef(false);
  const iframeRef = useRef(null);

  async function run() {
    setrunLoading(true)
    if (!webContainerInstance) {
      setrunLoading(false)
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

    await webContainerInstance.mount(files);

    if (data.compile) {
      const compileCommand = data.compile[0];
      const compileArgs = [...data.compile.slice(1), fileName, outputFileName];
      await webContainerInstance.spawn(compileCommand, compileArgs);
    }

    

    const runArgs = data.compile ? [outputFileName] : [fileName];
    const process = await webContainerInstance.spawn(data.run[0], [
      ...data.run.slice(1),
      ...runArgs,
    ]);




    let result = "";

    process.output.pipeTo(
      new WritableStream({
        async write(data) {
          result += data;
          const formattedResult = result.replace(/\n/g, '<br>');
          iframeRef.current.contentWindow.document.body.innerHTML = `${formattedResult}<input style="background-color: black; color: white; border-style:none; outline: none; box-shadow: none;" id="userInput" type="text" />`;
          const inputElement = iframeRef.current.contentWindow.document.getElementById('userInput');
          inputElement.focus();

          inputElement.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
              const input = inputElement.value + '\n';
              inputElement.value = '';

              const writer = process.input.getWriter();
              await writer.write(input);
              writer.releaseLock();
            }
          });
        },
      })
    );
    
    const exitCode = await process.exit;
    setrunLoading(false)
    console.log("Process exited with code:", exitCode);
  
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
    setCode("");
    fetch(`https://localhost:8443/project/getProject/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          setProject(res.project);
          setInitialCode(res.project.projectData);
          bootWebContainer(res.project);
        }
      })
      .catch((err) => {
        console.log("An unexpected error occured: " + err);
      });
  }

  function getLanguage(project) {
    console.log(project.language)
    if(project.language == "Python") {
      return python()
    }
    return null
  }

  useEffect(() => {
    if (project) {
      saveProject();
    }
  }, [code]);

  async function bootWebContainer(projectData) {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      try {
        const instance = await WebContainer.boot();
        setWebContainerInstance(instance);
        const data = languageIconsMap[projectData.language];
        data.install.forEach(async (ins) => {
          const array = ins.split(" ");
          await instance.spawn(array[0], [...array.slice(1)]);
        });
      } catch (error) {
        console.error("Error booting WebContainer", error);
      }
    }
  }

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = `
          <html>
            <body style="color:white; font-size: 1rem;">
              <code></code>
              <div id="inputArea"></div>
            </body>
          </html>`;
    }

    getProjectDetails();

    return () => {
      if (webContainerInstance) {
        webContainerInstance.teardown().catch((err) => {
          console.error("Error tearing down webcontainer");
        });
        setWebContainerInstance(null);
      }
    };
  }, []);

  return (
    <>
      <CodeNavbar loading={runLoading} onRun={run} setModal={() => setModal(!modal)} />
      <div className={style.ide}>
        <LiveblocksProvider
          publicApiKey={
            "pk_prod_XrfW_yUzfEcFyy5aov1mI2FcnANGtz_lQT7L_Uf3UMGYHbOyvHAfsgoltgd4xkcY"
          }
        >
          <RoomProvider id={id} initialStorage={{ code: initialCode }}>
            <ClientSideSuspense fallback={<div>Loading...</div>}>
              <Editor code={code} setCode={setCode} language={getLanguage} />
            </ClientSideSuspense>
          </RoomProvider>
        </LiveblocksProvider>
        <iframe ref={iframeRef} title="output"></iframe>
      </div>
      <InviteModal
        setInviteModal={setModal}
        inviteModal={modal}
        projectId={id}
      />
    </>
  );
}

export default CodeWindow;
