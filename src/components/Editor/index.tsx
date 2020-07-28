import * as React from 'react'
import { useEffect, useRef } from 'react'
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor'
import {
  onRegisterVue,
  onRegisterDart,
  onRegisterSvelte,
  useStore
} from 'services'
import { Language, IChatState } from 'types'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'

export interface Props extends MonacoEditorProps {
  readOnly?: boolean
}
interface State {}

const ReEditor: React.FunctionComponent<Props> = ({ readOnly, ...props }) => {
  const ref = useRef<MonacoEditor | null>(null)
  const { language, code } = useStore<IChatState>('chat')
  const dispatch = useDispatch()
  const editorWillMount = (monaco: typeof Monaco) => {
    onRegisterVue(monaco)
    onRegisterDart(monaco)
    onRegisterSvelte(monaco)
  }
  const editorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    editor.focus()
    const model = editor.getModel()
    if (!model) return
    const setModelLanguage = (lang: Language) =>
      Monaco.editor.setModelLanguage(model, lang)
    if (language === 'svelte' || language === 'vue') setModelLanguage('html')
    else if (language === 'dart') setModelLanguage('c')
    else if (language === 'visual basic') setModelLanguage('vb')
    else if (language === 'c#') setModelLanguage('csharp')
    else if (language === 'c++') setModelLanguage('cpp')
  }
  useEffect(() => {
    const models = Monaco.editor.getModels()
    const setModelLanguage = (lang: Language) =>
      Monaco.editor.setModelLanguage(models[0], lang)
    if (language === 'svelte' || language === 'vue') setModelLanguage('html')
    else if (language === 'dart') setModelLanguage('c')
    else if (language === 'visual basic') setModelLanguage('vb')
    else if (language === 'c#') setModelLanguage('csharp')
    else if (language === 'c++') setModelLanguage('cpp')
  }, [language])
  return (
    <MonacoEditor
      theme="vs-dark"
      height={props.height || '400'}
      ref={ref}
      options={{
        selectOnLineNumbers: true,
        readOnly,
        ...props.options
      }}
      editorDidMount={editorDidMount}
      editorWillMount={editorWillMount}
      language={language}
      value={code}
      onChange={(val) => dispatch(ChatActions.SET_CODE(val))}
      {...props}
    />
  )
}

ReEditor.defaultProps = {
  readOnly: false
}

export default ReEditor
