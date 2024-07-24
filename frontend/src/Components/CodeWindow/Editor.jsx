import React from 'react'
import CodeMirror, { lineNumbers } from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript'
import {tokyoNight} from '@uiw/codemirror-theme-tokyo-night'

function Editor({val, onChange}) {

  return (
    <CodeMirror
      theme={tokyoNight}
      value={val}
      height="100%"
      width="100%"
      extensions={[javascript({ jsx: true }), lineNumbers()]}
      onChange={(value, viewUpdate) => {
        onChange(value);
      }}
    />
  )
}

export default Editor