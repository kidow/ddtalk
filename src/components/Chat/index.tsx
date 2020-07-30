import React, { Fragment } from 'react'
import {
  IRoom,
  IRoomState,
  IAuthState,
  IChatState,
  IChat,
  IMention,
  ISettingState,
  IBotState
} from 'types'
import {
  Loader,
  Header,
  Icon,
  Comment,
  Divider,
  Label,
  Image,
  Modal
} from 'semantic-ui-react'
import moment from 'moment'
import { logEvent, useStore, useObject, createDoc } from 'services'
import { useDispatch } from 'react-redux'
import { ChatActions, MentionActions } from 'store'
import Linkify from 'react-linkify'
import './index.scss'
import { useParams } from 'react-router-dom'
import { ReEditor, ReDiffEditor, ReCodePreview } from 'components'

interface Props {
  room?: IRoom
  onCodeClick: (chat: IChat) => void
}
interface State {
  imageOpen: boolean
  previewImage: string
}

const ReChat: React.FunctionComponent<Props> = ({ room, onCodeClick }) => {
  const [{ imageOpen, previewImage }, setState] = useObject<State>({
    imageOpen: false,
    previewImage: ''
  })
  const { id } = useParams()
  const { menus } = useStore<IBotState>('bot')
  const { loading } = useStore<IRoomState>('room')
  const { uid, nickname, photoURL } = useStore<IAuthState>('auth')
  const { mentions } = useStore<IChatState>('chat')
  const { size, fcm_token } = useStore<ISettingState>('setting')
  const dispatch = useDispatch()

  const onUsernameClick = (chat: IChat) => {
    if (chat.userId === 'ddbot') return
    const mentionIndex = mentions.findIndex(
      (mention) => mention.uid === chat.userId
    )
    if (mentionIndex === -1) {
      logEvent('유저_멘션_클릭')
      dispatch(
        ChatActions.SET_CHAT({
          mentions: [
            ...mentions,
            {
              avatar: chat.avatar,
              username: chat.username,
              uid: chat.userId,
              fcm_token: chat.fcm_token
            }
          ]
        })
      )
    }
  }

  const onMentionLabelClick = (mention: IMention) => {
    const mentionIndex = mentions.findIndex((data) => data.uid === mention.uid)
    if (mentionIndex === -1) {
      logEvent('멘션_유저_멘션_클릭')
      dispatch(
        ChatActions.SET_CHAT({
          mentions: [
            ...mentions,
            {
              avatar: mention.avatar,
              username: mention.username,
              uid: mention.uid,
              fcm_token: mention.fcm_token
            }
          ]
        })
      )
    }
  }

  const onCodeLabelClick = (chat: IChat) => {
    logEvent('코드_라벨_클릭')
    onCodeClick(chat)
    dispatch(ChatActions.SET_CHAT({ language: chat.language }))
    dispatch(ChatActions.SET_ORIGINAL_CODE(chat.originalCode))
    if (chat.modifiedCode) {
      dispatch(ChatActions.SET_CODE(chat.modifiedCode))
      dispatch(ChatActions.SET_MODIFIED_CODE(chat.modifiedCode))
    } else dispatch(ChatActions.SET_CODE(chat.originalCode))
    dispatch(
      MentionActions.SET_MENTION({
        username: chat.username,
        uid: chat.userId,
        avatar: chat.avatar,
        fcm_token: chat.fcm_token
      })
    )
  }

  const onCommandClick = async (command: string) => {
    if (command === '#메뉴추천') {
      await createDoc('chat', {
        message: command,
        roomId: id,
        userId: uid,
        username: nickname,
        avatar: photoURL,
        language: '',
        images: [],
        mentions,
        commands: [],
        fcm_token: fcm_token || ''
      })
      await createDoc('chat', {
        message: menus[Math.floor(Math.random() * menus.length)],
        roomId: id,
        userId: 'ddbot',
        username: '디디봇',
        avatar: '/ddbot.svg',
        language: '',
        images: [],
        mentions: [],
        fcm_token: fcm_token || ''
      })
    }
  }

  const onImageLabelClick = (image: any) => {
    logEvent('이미지_라벨_클릭')
    setState({
      previewImage: image,
      imageOpen: true
    })
  }

  return (
    <>
      {loading ? (
        <div className="chat__loader">
          <Loader active={loading} inline />
        </div>
      ) : !room ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Header as="h2" icon>
            <Icon name="frown outline" />
            <span style={{ fontSize: 60 }}>404</span>
            <Header.Subheader>존재하지 않는 방입니다...</Header.Subheader>
          </Header>
        </div>
      ) : (
        <Comment.Group size={size}>
          {room &&
            room.chats.map((chat, i, array) => (
              <Fragment key={i}>
                {/* 첫 날짜 */}
                {i === 0 && (
                  <Divider style={{ fontWeight: 400 }} horizontal>
                    {moment(chat.createdAt).format('YYYY년 MM월 DD일')}
                  </Divider>
                )}
                {/* 날짜 넘어갈 때 */}
                {i > 0 &&
                  moment(
                    moment(array[i - 1].createdAt).format('YYYY-MM-DD')
                  ).isBefore(moment(chat.createdAt).format('YYYY-MM-DD')) && (
                    <Divider style={{ fontWeight: 400 }} horizontal>
                      {moment(chat.createdAt).format('YYYY년 MM월 DD일')}
                    </Divider>
                  )}
                {/* 일반 채팅 */}
                <Comment key={i} className={chat.userId === uid ? 'my' : ''}>
                  {chat.userId !== uid && (
                    <Comment.Avatar
                      src={
                        chat.avatar ||
                        'https://react.semantic-ui.com/images/avatar/small/matt.jpg'
                      }
                    />
                  )}
                  <Comment.Content>
                    {chat.userId !== uid && (
                      <Comment.Author
                        as="a"
                        onClick={() => onUsernameClick(chat)}
                      >
                        {chat.username}
                      </Comment.Author>
                    )}
                    <Comment.Metadata>
                      <div>{moment(chat.createdAt).format('HH:mm A')}</div>
                    </Comment.Metadata>
                    <Comment.Text>
                      <Linkify
                        componentDecorator={(
                          decoratedHref,
                          decoratedText,
                          key
                        ) => (
                          <a target="blank" href={decoratedHref} key={key}>
                            {decoratedText}
                          </a>
                        )}
                      >
                        {chat.message}
                      </Linkify>
                    </Comment.Text>
                    <Comment.Actions>
                      {!!chat.giphy && (
                        <Comment.Action>
                          <iframe
                            style={{ border: 'none', width: '100%' }}
                            onClick={(e) => e.preventDefault()}
                            src={chat.giphy}
                          />
                        </Comment.Action>
                      )}
                      {chat.commands
                        ? chat.commands.map((item) => (
                            <Comment.Action key={item}>
                              <Label
                                size="mini"
                                onClick={() => onCommandClick(item)}
                              >
                                {item}
                              </Label>
                            </Comment.Action>
                          ))
                        : null}
                      {chat.mentions.map((mention, index) => (
                        <Comment.Action key={index}>
                          <Label
                            onClick={() => onMentionLabelClick(mention)}
                            size="mini"
                            image
                          >
                            <img src={mention.avatar} />
                            {mention.username}
                          </Label>
                        </Comment.Action>
                      ))}
                      {/* {!!chat.originalCode && (
                        <Comment.Action>
                          <Label
                            onClick={() => onCodeLabelClick(chat)}
                            size="mini"
                          >
                            {chat.language}
                          </Label>
                        </Comment.Action>
                      )} */}
                      <Image.Group size="small">
                        {chat.images.map((image: any, i: number) => (
                          <Image
                            key={i}
                            src={image}
                            onClick={() => onImageLabelClick(image)}
                          />
                        ))}
                      </Image.Group>
                    </Comment.Actions>
                    {!!chat.originalCode && (
                      <Comment.Actions>
                        <ReCodePreview
                          originalCode={chat.originalCode}
                          language={chat.language}
                          modifiedCode={chat.modifiedCode}
                        />
                        {/* {chat.modifiedCode ? (
                            <ReDiffEditor
                              height="400"
                              readOnly
                              original={chat.originalCode}
                              value={chat.modifiedCode}
                              language={chat.language}
                            />
                          ) : (
                            <ReEditor
                              language={chat.language}
                              readOnly
                              height="400"
                              value={chat.originalCode}
                            />
                          )} */}
                      </Comment.Actions>
                    )}
                  </Comment.Content>
                </Comment>
              </Fragment>
            ))}
        </Comment.Group>
      )}
      <Modal
        basic
        open={imageOpen}
        onClose={() => setState({ previewImage: '', imageOpen: false })}
      >
        <Image src={previewImage} centered />
      </Modal>
    </>
  )
}

export default ReChat
