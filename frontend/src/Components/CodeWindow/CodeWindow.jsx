import React from 'react'
import style from '../../Styles/codewindow.module.css'
import { useParams } from 'react-router'
import Editor from './Editor';

function CodeWindow() {
  const {projectId} = useParams();
  return (
    <>
        <div className={style.divider}></div>
        <Editor/>
    </>
  )
}

export default CodeWindow