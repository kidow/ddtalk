import React from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, BaseEmoji } from 'emoji-mart'
import { logEvent, useStore } from 'services'
import { useDispatch } from 'react-redux'
import { IChatState } from 'types'
import { ChatActions } from 'store'
import ClickAwayListener from 'react-click-away-listener'

interface Props {
  open: boolean
  onClose: () => void
}
interface State {}

const ReEmojiPortal: React.FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const dispatch = useDispatch()
  const { message } = useStore<IChatState>('chat')
  return (
    <ClickAwayListener
      style={{
        position: 'absolute',
        zIndex: 1000,
        bottom: '75%',
        boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
        border: '1px solid rgba(34,36,38,.15)',
        borderRadius: 4
      }}
      onClickAway={onClose}
    >
      <Picker
        i18n={{ search: '검색' }}
        onSelect={(value: BaseEmoji) => {
          dispatch(ChatActions.SET_MESSAGE(message + value.native))
          logEvent('이모지_삽입', { emoji_id: value.id })
        }}
      />
    </ClickAwayListener>
  )
}

export default ReEmojiPortal
