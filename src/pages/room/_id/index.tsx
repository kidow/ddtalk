import React, { FunctionComponent, useEffect, useRef } from 'react'
import {
  ReTextarea,
  ReModalEditor,
  ReSEO,
  ReModalCode,
  ReChat,
  ReEmojiPortal,
  ReGiphy
} from 'components'
import {
  Icon,
  Button,
  Dimmer,
  Loader,
  Dropdown,
  DropdownItemProps,
  Segment
} from 'semantic-ui-react'
import { ChatActions, MentionActions, AuthActions } from 'store'
import {
  useStore,
  useObject,
  createDoc,
  toBase64,
  toastInfo,
  logEvent,
  toastWarn,
  dataURLtoFile,
  upload,
  isAuthRequired,
  callBot
} from 'services'
import {
  IAuthState,
  IRoomState,
  IChatState,
  IBotState,
  ICodeState,
  ISettingState
} from 'types'
import './index.scss'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { isMacOs, isBrowser } from 'react-device-detect'
import ClickAwayListener from 'react-click-away-listener'

export interface Props {}
interface State {
  codeOpen: boolean
  uploading: boolean
  emojiOpen: boolean
  codePreviewOpen: boolean
  count: number
  giphyOpen: boolean
}

const Room: FunctionComponent<Props> = () => {
  const [
    { codeOpen, uploading, emojiOpen, codePreviewOpen, count, giphyOpen },
    setState
  ] = useObject<State>({
    codeOpen: false,
    uploading: false,
    emojiOpen: false,
    codePreviewOpen: false,
    count: 0,
    giphyOpen: false
  })
  const ref = useRef<HTMLDivElement | null>(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const { push } = useHistory()
  const { fcm_token } = useStore<ISettingState>('setting')
  const { menus } = useStore<IBotState>('bot')
  const { languages } = useStore<ICodeState>('code')
  const { uid, nickname, photoURL, isLoggedIn } = useStore<IAuthState>('auth')
  const { rooms } = useStore<IRoomState>('room')
  const { message, mentions, images, language } = useStore<IChatState>('chat')
  const onSubmit = async () => {
    if (count >= 3) {
      logEvent('도배_시도')
      toastWarn('도배는 자제 부탁드립니다.')
      return
    }
    logEvent('일반_채팅_클릭')
    if (!images.length) {
      if (!message || !message.replace(/\\n/g, '') || !message.trim()) return
    }
    if (!isLoggedIn) return toastInfo(isAuthRequired)
    let urls: string[] = []
    if (images.length) {
      setState({ uploading: true })
      for (const image of images) {
        let file = dataURLtoFile(image)
        const downloadUrl = (await upload({
          file,
          child: `image/${moment().format(
            'YYYY-MM-DD'
          )}/${new Date().getTime()}`
        })) as string
        urls.push(downloadUrl)
      }
    }

    dispatch(ChatActions.SET_MESSAGE(''))

    await createDoc('chat', {
      message: message.trim(),
      roomId: id,
      userId: uid,
      username: nickname,
      avatar: photoURL,
      language: '',
      images: urls,
      mentions,
      commands: [],
      fcm_token: fcm_token || ''
    })
    setState({ count: count + 1, uploading: false })
    dispatch(ChatActions.INITIALIZE())
    logEvent('채팅_생성')
    if (message === '#디디봇') await callBot(id)
    else if (message === '#메뉴추천')
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
    onScrollTop()
  }

  const onScrollTop = () => {
    if (ref.current) window.scrollTo(0, ref.current.scrollHeight)
  }

  const imageUpload = () => {
    logEvent('이미지_업로드_클릭')
    if (!isLoggedIn) {
      dispatch(AuthActions.SET_OPEN(true))
      return
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = async (e) => {
      if (!e.target) return
      // @ts-ignore
      const { files } = e.target
      let filePathsPromises: any[] = []
      for (let i = 0; i < files.length; i++)
        filePathsPromises.push(toBase64(files[i]))
      const images = await Promise.all(filePathsPromises)
      if (images.length > 3) return toastInfo('이미지는 최대 3개까지입니다.')
      logEvent('임시_이미지_업로드', {
        // @ts-ignore
        amount: files.length
      })
      dispatch(ChatActions.SET_CHAT({ images }))
    }
    input.click()
  }
  const onRegisterShortcut = (e: KeyboardEvent) => {
    if (!e.ctrlKey || !e.altKey) return
    if (isMacOs) {
      if (e.key === 'µ') {
        logEvent('이모지_단축키_입력')
        setState({ emojiOpen: true })
      } else if (e.key === 'Dead') {
        logEvent('이미지_단축키_입력')
        imageUpload()
      } else if (e.key === 'ç') {
        logEvent('코드_단축키_입력')
        setState({ codeOpen: true })
      }
    } else {
      if (e.key === 'i') {
        logEvent('이미지_단축키_입력')
        imageUpload()
      } else if (e.key === 'c') {
        logEvent('코드_단축키_입력')
        setState({ codeOpen: true })
      } else if (e.key === 'm') {
        logEvent('이모지_단축키_입력')
        setState({ emojiOpen: true })
      }
    }
  }

  const onCodeClick = () => {
    logEvent('코드_삽입_클릭')
    isLoggedIn
      ? setState({ codeOpen: true })
      : dispatch(AuthActions.SET_OPEN(true))
  }
  const onEmojiClick = () => {
    logEvent('이모지_삽입_클릭')
    isLoggedIn
      ? setState({ emojiOpen: true })
      : dispatch(AuthActions.SET_OPEN(true))
  }
  const onBotClick = async () => {
    if (!isLoggedIn) {
      dispatch(AuthActions.SET_OPEN(true))
      return
    }
    await createDoc('chat', {
      message: '#디디봇',
      roomId: id,
      userId: uid,
      username: nickname,
      avatar: photoURL,
      language: '',
      images: [],
      mentions: [],
      commands: [],
      fcm_token: fcm_token || ''
    })
    await callBot(id)
    onScrollTop()
  }

  const room = rooms.find((room) => room.id === id)
  const title = room ? room.name : ''
  const image = room ? room.thumbnail : ''
  const options: DropdownItemProps[] = [
    {
      key: 'image',
      text: '이미지 업로드',
      icon: 'images outline',
      onClick: imageUpload,
      description: `ctrl ${isMacOs ? 'option' : 'alt'} i`,
      selected: false
    },
    {
      key: 'code',
      text: '코드 삽입',
      icon: 'code',
      onClick: onCodeClick,
      description: `ctrl ${isMacOs ? 'option' : 'alt'} c`
    },
    {
      key: 'emoji',
      text: '이모지 삽입',
      icon: 'smile outline',
      onClick: onEmojiClick,
      description: `ctrl ${isMacOs ? 'option' : 'alt'} m`
    },
    {
      key: 'bot',
      text: '디디봇',
      icon: <img src="/robot.png" className="robot" />,
      onClick: onBotClick,
      description: '#디디봇'
    },
    {
      key: 'giphy',
      text: 'Giphy',
      icon: <img src="/giphy-logo.svg" className="robot" />,
      onClick: () => setState({ giphyOpen: true }),
      description: '움짤, 스티커, 텍스트'
    }
  ]
  useEffect(() => {
    const timer = setInterval(() => {
      if (count) setState({ count: 0 })
    }, 5000)
    return () => clearInterval(timer)
  }, [count])
  useEffect(() => {
    if (!isLoggedIn) document.removeEventListener('keydown', onRegisterShortcut)
    else document.addEventListener('keydown', onRegisterShortcut)
    return () => document.removeEventListener('keydown', onRegisterShortcut)
  }, [isLoggedIn])
  useEffect(() => {
    if (room && languages.indexOf(room.name.toLowerCase()) !== -1) {
      dispatch(ChatActions.SET_CHAT({ language: room.name.toLowerCase() }))
    }
  }, [room, id])
  useEffect(() => {
    onScrollTop()
  }, [id])
  return (
    <>
      <ReSEO title={title} image={image} />
      <div className="chat-container">
        <div className="chat-title__container">
          <div className="chat-title-bar">
            {!isBrowser && (
              <div
                style={{ marginRight: 4, cursor: 'pointer' }}
                onClick={() => push('/')}
              >
                <Icon name="arrow left" />
              </div>
            )}
            <h1>{room ? room.name : ''}</h1>
          </div>
        </div>
        <div className="chat-message__container" ref={ref}>
          <ReChat
            room={room}
            onScrollTop={onScrollTop}
            onCodeClick={() => setState({ codePreviewOpen: true })}
          />
        </div>
        <div className="chat__input__wrapper">
          <div className="chat__input__container">
            <div className="chat__input">
              <Dropdown
                icon={null}
                trigger={<Icon className="addon" name="add" size="large" />}
                direction="right"
                options={options}
              />
              <ReEmojiPortal
                open={emojiOpen}
                onClose={() => setState({ emojiOpen: false })}
              />
              <ReGiphy
                open={giphyOpen}
                onClose={() => setState({ giphyOpen: false })}
                onScrollTop={onScrollTop}
              />
              <div className="form__container">
                <ReTextarea
                  value={message}
                  onChange={(e) =>
                    dispatch(ChatActions.SET_MESSAGE(e.target.value))
                  }
                  onEnter={onSubmit}
                />
                <Button
                  onClick={onSubmit}
                  circular
                  icon="send"
                  className="send"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReModalCode
        onScrollTop={onScrollTop}
        language={language}
        open={codePreviewOpen}
        onClose={() => {
          dispatch(
            ChatActions.SET_CHAT({
              language: room ? room.name.toLowerCase() : 'javascript'
            })
          )
          dispatch(ChatActions.INITIALIZE_CODE())
          setState({ codePreviewOpen: false })
          dispatch(MentionActions.INITIALIZE())
        }}
      />
      <ReModalEditor
        open={codeOpen}
        onScrollTop={onScrollTop}
        onClose={() => {
          dispatch(
            ChatActions.SET_CHAT({
              language: room ? room.name.toLowerCase() : 'javascript'
            })
          )
          dispatch(ChatActions.SET_CODE(''))
          setState({ codeOpen: false })
          dispatch(MentionActions.INITIALIZE())
        }}
      />

      <Dimmer active={uploading}>
        <Loader>이미지 업로드 중입니다...</Loader>
      </Dimmer>
    </>
  )
}

export default Room
