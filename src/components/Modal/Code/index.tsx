import React from 'react'
import { Modal, ModalProps, Popup, Icon, Button } from 'semantic-ui-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  logEvent,
  toastSuccess,
  useStore,
  useObject,
  createDoc,
  placeholder,
  isAuthRequired,
  sendMessage
} from 'services'
import { ReEditor, ReDiffEditor } from 'components'
import './index.scss'
import { IAuthState, IChatState, ISettingState, IRoomState } from 'types'
import TextAreaAutoSize from 'react-textarea-autosize'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'
import { useParams } from 'react-router-dom'

interface Props extends ModalProps {
  onClose: () => void
}
interface State {
  message: string
  loading: boolean
}

const ReModalCode: React.FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const [{ message, loading }, setState, onChange] = useObject<State>({
    message: '',
    loading: false
  })
  const { isLoggedIn, uid, photoURL, nickname, email } = useStore<IAuthState>(
    'auth'
  )
  const { code, language, modifiedCode, mentions, originalCode } = useStore<
    IChatState
  >('chat')
  const { fcm_token } = useStore<ISettingState>('setting')
  const { rooms } = useStore<IRoomState>('room')
  const { id } = useParams()
  const dispatch = useDispatch()
  const onModifiedCodeEmbed = async () => {
    if (!isLoggedIn || !uid) return
    try {
      let data: any = {
        roomId: id,
        userId: uid,
        message,
        language,
        avatar: photoURL,
        username: nickname,
        images: [],
        mentions,
        modifiedCode: code.trim(),
        commands: [],
        fcm_token: fcm_token || ''
      }
      if (modifiedCode) data.originalCode = modifiedCode
      else data.originalCode = originalCode

      await createDoc('chat', data)
      logEvent('코드_멘션', {
        language,
        room_id: id,
        uid,
        email
      })
      if (mentions.length) {
        const room = rooms.find((room) => room.id === id)
        mentions.forEach(async (mention) => {
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
    } catch (err) {
      console.log(err)
      setState({ loading: false })
    } finally {
      onClose()
      dispatch(ChatActions.INITIALIZE())
    }
  }
  return (
    <Modal size="large" className="code__modal" open={open} onClose={onClose}>
      <Modal.Header>
        <>{language}</>
        <div>
          <Popup
            content="코드 복사"
            position="top center"
            trigger={
              <CopyToClipboard
                text={modifiedCode || originalCode}
                onCopy={() => {
                  logEvent('코드_복사')
                  toastSuccess('코드가 복사되었습니다.')
                }}
              >
                <Icon
                  name="copy outline"
                  size="large"
                  style={{ cursor: 'pointer' }}
                />
              </CopyToClipboard>
            }
          />
        </div>
      </Modal.Header>
      {modifiedCode ? <ReDiffEditor /> : <ReEditor />}
      <div style={{ position: 'relative' }}>
        <TextAreaAutoSize
          value={message}
          name="message"
          onChange={onChange}
          disabled={!isLoggedIn}
          minRows={5}
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
          onClick={onModifiedCodeEmbed}
          style={{ position: 'absolute', bottom: 15, right: 8 }}
        />
      </div>
    </Modal>
  )
}

export default ReModalCode
