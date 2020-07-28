import React from 'react'
import { CopyBlock, tomorrowNight } from 'react-code-blocks'
import { Language } from 'types'
import DiffViewer, { DiffMethod } from 'react-diff-viewer'

interface Props {
  originalCode: string
  modifiedCode: string
  language: Language
}
interface State {}

const ReCodeBlocks: React.FunctionComponent<Props> = ({
  originalCode,
  language,
  modifiedCode
}) => {
  const renderContent = (source: string) => {
    return <pre style={{ display: 'inline', textAlign: 'right' }}>{source}</pre>
  }
  return (
    <div style={{ fontSize: 14, textAlign: 'left' }}>
      {modifiedCode ? (
        <DiffViewer
          oldValue={originalCode}
          newValue={modifiedCode}
          splitView={false}
          useDarkTheme
          renderContent={renderContent}
        />
      ) : (
        <CopyBlock
          text={originalCode}
          language={language}
          showLineNumbers
          theme={tomorrowNight}
          wrapLines
          codeBlock
        />
      )}
    </div>
  )
}

export default ReCodeBlocks
