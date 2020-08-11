import * as React from 'react'
import { useRef, useEffect } from 'react'
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MonacoDiffEditor, MonacoDiffEditorProps } from 'react-monaco-editor'
import { Language, IChatState } from 'types'
import { useStore } from 'services'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'

interface Props extends MonacoDiffEditorProps {
  readOnly?: boolean
}
interface State {}

const ReDiffEditor: React.FunctionComponent<Props> = (props) => {
  const ref = useRef<MonacoDiffEditor | null>(null)
  const { modifiedCode, code, language, originalCode } = useStore<IChatState>(
    'chat'
  )
  const dispatch = useDispatch()
  const editorDidMount = (
    editor: Monaco.editor.IStandaloneDiffEditor,
    monaco: typeof Monaco
  ) => {
    const model = editor.getModel()
    if (!model) return
    const setModelLanguage = (language: Language) =>
      monaco.editor.setModelLanguage(model.modified, language)
    if (props.language === 'svelte' || props.language === 'vue')
      setModelLanguage('html')
    else if (props.language === 'dart') setModelLanguage('c')
    else if (props.language === 'visual basic') setModelLanguage('vb')
    else if (props.language === 'c#') setModelLanguage('csharp')
    else if (props.language === 'c++') setModelLanguage('cpp')
    else if (props.language === 'flutter') setModelLanguage('dart')
  }
  return (
    <MonacoDiffEditor
      ref={ref}
      theme="vs-dark"
      options={{
        selectOnLineNumbers: true,
        enableSplitViewResizing: false,
        renderSideBySide: false,
        readOnly: props.readOnly,
        ...props.options
      }}
      editorDidMount={editorDidMount}
      language={language}
      value={code}
      original={originalCode}
      onChange={(val) => dispatch(ChatActions.SET_CODE(val))}
      {...props}
    />
  )
}

ReDiffEditor.defaultProps = {
  readOnly: false
}

export default ReDiffEditor
