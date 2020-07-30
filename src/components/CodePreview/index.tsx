import React from 'react'
import { CopyBlock, tomorrowNight } from 'react-code-blocks'
import { Language } from 'types'
import DiffViewer, { DiffMethod } from 'react-diff-viewer'
import { Icon } from 'semantic-ui-react'

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
    <div style={{ fontSize: 14, textAlign: 'left', position: 'relative' }}>
      {modifiedCode ? (
        <DiffViewer
          oldValue={originalCode}
          newValue={modifiedCode}
          splitView={false}
          useDarkTheme
          renderContent={renderContent}
        />
      ) : (
        <>
          <button
            style={{
              position: 'absolute',
              opacity: 0.5,
              top: '0.5em',
              right: '0.75em'
            }}
          >
            a
            <Icon name="at" />
          </button>
          <CopyBlock
            text={originalCode}
            language={language}
            showLineNumbers
            theme={tomorrowNight}
            wrapLines
            codeBlock
          />
        </>
      )}
    </div>
  )
}

export default ReCodeBlocks
