import React from 'react'
import CodeMirror, { lineNumbers } from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript'

function Editor() {
  return (
    <CodeMirror 
    height="200px" 
    width="50%" 
    extensions={[javascript({ jsx: true })]} 
    options={{
        lineNumbers: true,
    }}/>
  )
}

export default Editor