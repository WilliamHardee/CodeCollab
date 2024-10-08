import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { coolGlow } from "thememirror";
import style from "../../Styles/codewindow.module.css"
import { python } from "@codemirror/lang-python";
import {javascript} from "@codemirror/lang-javascript"
import {indentWithTab} from "@codemirror/commands"
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { LiveblocksProvider, useOthers, useRoom, useStorage } from "@liveblocks/react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import session from "../../Session";

function Editor({ code, setCode, project }) {
  const viewRef = useRef(null);
  const room = useRoom();
  const others = useOthers();


  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

 

  useEffect(() => {
    if(!project?.language) {
      return
    }
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("codemirror");
    const liveBlocksProvider = new LiveblocksYjsProvider(room, yDoc);

    liveBlocksProvider.awareness.setLocalStateField("user", {
      name: session.getSession("username"),
      color: getRandomColor(),
    })

    const mode = project.language == "Python" ? python() : javascript()
    let startState = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        mode,
        coolGlow,
        keymap.of([indentWithTab]),
        yCollab(yText, liveBlocksProvider.awareness),
        EditorView.updateListener.of((update) => {
          if(update.docChanged) {
            setCode(update.state.doc.toString());
          }
        })
      ],
    });

    let view = new EditorView({
      state: startState,
      parent: document.querySelector("#editorContainer"),
    });

    viewRef.current = view;
    return () => {
      liveBlocksProvider.destroy();
      view.destroy();
    };
  }, [project]);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code
        }
      });
    }
  }, [code]);

  return <div className={style.editorContainer} id="editorContainer"></div>;
}

export default Editor;