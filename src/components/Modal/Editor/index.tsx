import React, { useEffect } from 'react'
import {
  ModalProps,
  Modal,
  Dropdown,
  DropdownItemProps,
  Button
} from 'semantic-ui-react'
import './index.scss'
import {
  useObject,
  createDoc,
  useStore,
  logEvent,
  placeholder,
  isAuthRequired,
  sendMessage
} from 'services'
import { ReEditor, ReMentions } from 'components'
import {
  IAuthState,
  IChatState,
  ICodeState,
  ISettingState,
  IRoomState
} from 'types'
import { useParams } from 'react-router-dom'
import TextAreaAutoSize from 'react-textarea-autosize'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'
import { isBrowser } from 'react-device-detect'

export interface Props extends ModalProps {
  onClose: () => void
}
interface State {
  loading: boolean
  message: string
}

const ReModalEditor: React.FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const [{ loading, message }, setState, onChange] = useObject<State>({
    loading: false,
    message: ''
  })
  const { uid, photoURL, nickname, isLoggedIn } = useStore<IAuthState>('auth')
  const { mentions, code, language } = useStore<IChatState>('chat')
  const { id } = useParams()
  const { codes, languages } = useStore<ICodeState>('code')
  const { rooms } = useStore<IRoomState>('room')
  const { fcm_token } = useStore<ISettingState>('setting')
  const dispatch = useDispatch()
  const onCodeEmbed = async () => {
    if (!isLoggedIn || !uid) return
    if (!code) return
    setState({ loading: true })
    try {
      await createDoc('chat', {
        roomId: id,
        userId: uid,
        message,
        language,
        avatar: photoURL,
        username: nickname,
        originalCode: code.trim(),
        images: [],
        modifiedCode: '',
        mentions,
        commands: [],
        fcm_token
      })
      if (mentions.length) {
        mentions.forEach(async (mention) => {
          const room = rooms.find((room) => room.id === id)
          if (mention.fcm_token && room)
            await sendMessage(
              {
                to: mention.fcm_token,
                notification: {
                  title: nickname,
                  body: message,
                  icon: `/${room.name}.svg`
                },
                webpush: {
                  fcm_options: {
                    link: window.location.href
                  }
                }
              },
              fcm_token
            )
        })
      }
      logEvent('코드_삽입', {
        language,
        room_id: id
      })
      onClose()
      dispatch(ChatActions.INITIALIZE())
    } catch (err) {
      console.log(err)
      setState({ loading: false })
    }
  }
  const options: DropdownItemProps[] = languages.map((text) => ({
    key: text,
    value: text,
    text
  }))
  useEffect(() => {
    const sample = codes.find((item) => item.language === language)
    if (sample && sample.code) dispatch(ChatActions.SET_CODE(sample.code))
  }, [language])
  useEffect(() => {
    return () => {
      dispatch(ChatActions.SET_CODE(''))
    }
  }, [])
  return (
    <Modal className="editor__modal" open={open} onClose={onClose} size="large">
      <Modal.Header>
        <div className="header__left">
          <span>코드 삽입</span>
        </div>
        <Dropdown
          value={language}
          direction={isBrowser ? 'right' : 'left'}
          noResultsMessage="해당 사항이 없습니다."
          placeholder="언어 선택"
          onChange={(e, { value }) =>
            dispatch(ChatActions.SET_CHAT({ language: value as string }))
          }
          options={options}
          className="code__dropdown"
        />
      </Modal.Header>
      <ReEditor height="400" />
      <ReMentions />
      <div style={{ position: 'relative' }}>
        <TextAreaAutoSize
          value={message}
          name="message"
          onChange={onChange}
          minRows={5}
          disabled={!isLoggedIn}
          placeholder={isLoggedIn ? placeholder : isAuthRequired}
          style={{
            borderColor: '#dee2e6',
            padding: '16px 16px 24px'
          }}
        />
        <Button
          icon="send"
          loading={loading}
          circular
          color="orange"
          onClick={onCodeEmbed}
          style={{ position: 'absolute', bottom: 15, right: 8 }}
        />
      </div>
    </Modal>
  )
}

export default ReModalEditor
