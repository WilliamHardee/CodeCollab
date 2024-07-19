import React from 'react'
import CodeMirror, { lineNumbers } from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript'

function Editor({val, onInput}) {

  return (
    <CodeMirror 
    value={val}
    height="200px" 
    width="50%" 
    extensions={[javascript({ jsx: true })]} 
    options={{
        lineNumbers: true,
    }}
    onChange={(value) => onInput(value)}/>
  )
}

export default Editor