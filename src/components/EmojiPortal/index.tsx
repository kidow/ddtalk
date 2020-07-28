import React from 'react'
import { Portal } from 'semantic-ui-react'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, BaseEmoji } from 'emoji-mart'
import { logEvent, useStore } from 'services'
import { useDispatch } from 'react-redux'
import { IChatState } from 'types'
import { ChatActions } from 'store'
import { isMobile } from 'react-device-detect'

interface Props {
  open: boolean
  onClose: () => void
}
interface State {}

const ReEmojiPortal: React.FunctionComponent<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const { message } = useStore<IChatState>('chat')
  return (
    <Portal
      closeOnTriggerClick
      openOnTriggerClick
      open={open}
      onClose={onClose}
    >
      <Picker
        style={{
          left: isMobile ? '0%' : '38%',
          position: 'absolute',
          bottom: '5%',
          zIndex: 1000
        }}
        i18n={{ search: '검색' }}
        onSelect={(value: BaseEmoji) => {
          dispatch(ChatActions.SET_MESSAGE(message + value.native))
          logEvent('이모지_삽입', { emoji_id: value.id })
        }}
      />
    </Portal>
  )
}

export default ReEmojiPortal
