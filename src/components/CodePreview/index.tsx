import React, { FunctionComponent } from 'react'
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import MonacoEditor, {
  MonacoEditorProps,
  MonacoDiffEditor
} from 'react-monaco-editor'
import './index.scss'
import { Icon, Popup } from 'semantic-ui-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { logEvent, toastSuccess } from 'services'

interface Props extends MonacoEditorProps {
  originalCode: string
  modifiedCode?: string
  language: string
  onCodeLabelClick: () => void
}
interface State {}

const ReCodePreview: FunctionComponent<Props> = ({
  originalCode,
  modifiedCode,
  onCodeLabelClick,
  language,
  ...props
}) => {
  const editorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    const element = editor.getDomNode()
    if (!element) return
    const model = editor.getModel()
    if (!model) return
    const lineHeight = editor.getOption(Monaco.editor.EditorOption.lineHeight)
    const lineCount = model.getLineCount() || 1
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight
    element.style.height = `${height}px`
    element.style.maxHeight = `${height}px`
    editor.layout()
  }
  const diffEditorDidMount = (
    editor: Monaco.editor.IStandaloneDiffEditor,
    monaco: typeof Monaco
  ) => {
    const element = editor.getDomNode()
    const model = editor.getModel()
    if (!model || !modifiedCode) return
    editor.onDidUpdateDiff(() => {
      const lineChanges = editor.getLineChanges()
      const originalLineHeight = editor
        .getOriginalEditor()
        .getOption(Monaco.editor.EditorOption.lineHeight)
      const modifiedLineHeight = editor
        .getModifiedEditor()
        .getOption(Monaco.editor.EditorOption.lineHeight)
      const originalLineCount = model.original.getLineCount() || 1
      const modifiedLineCount = lineChanges ? lineChanges.length : 0
      const originalHeight =
        editor.getOriginalEditor().getTopForLineNumber(originalLineCount + 1) +
        originalLineHeight
      const modifiedHeight =
        editor.getModifiedEditor().getTopForLineNumber(modifiedLineCount) +
        modifiedLineHeight
      const height = originalHeight + modifiedHeight
      element.style.height = `${height}px`
      element.style.maxHeight = `${height}px`
      editor.layout()
    })
  }
  return (
    <div className="code-preview__container">
      <Popup
        content={language}
        trigger={<Icon name="language" className="button language" />}
        basic
        inverted
      />
      <CopyToClipboard
        text={modifiedCode || originalCode}
        onCopy={() => {
          logEvent('코드_복사')
          toastSuccess('코드가 복사되었습니다.')
        }}
      >
        <Icon name="copy" className="button copy" />
      </CopyToClipboard>
      <Icon name="at" className="button mention" onClick={onCodeLabelClick} />
      {modifiedCode ? (
        <MonacoDiffEditor
          original={originalCode}
          defaultValue={modifiedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            scrollbar: { vertical: 'hidden' },
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            renderSideBySide: false
          }}
          editorDidMount={diffEditorDidMount}
        />
      ) : (
        <MonacoEditor
          theme="vs-dark"
          editorDidMount={editorDidMount}
          options={{
            readOnly: true,
            scrollbar: { vertical: 'hidden' },
            scrollBeyondLastLine: false,
            minimap: { enabled: false }
          }}
          defaultValue={originalCode}
          {...props}
        />
      )}
    </div>
  )
}

export default ReCodePreview
