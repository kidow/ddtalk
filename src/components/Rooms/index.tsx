import React from 'react'
import {
  ReModalAdmin,
  ReModalSetting,
  ReLogo,
  ReModalIntro,
  ReModalImprove
} from 'components'
import {
  List,
  Image,
  Dropdown,
  DropdownItemProps,
  Loader,
  Placeholder
} from 'semantic-ui-react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import './index.scss'
import { useDispatch } from 'react-redux'
import { AuthActions } from 'store'
import { IAuthState, IRoomState } from 'types'
import { useObject, signOut, useStore, logEvent } from 'services'
import moment from 'moment'
import { isBrowser } from 'react-device-detect'

export interface Props {}
interface State {
  adminOpen: boolean
  settingOpen: boolean
  introOpen: boolean
  improveOpen: boolean
}

const ReRooms: React.FunctionComponent<Props> = () => {
  const { push } = useHistory()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const { photoURL, uid } = useStore<IAuthState>('auth')
  const { rooms, loading } = useStore<IRoomState>('room')
  const [
    { adminOpen, settingOpen, introOpen, improveOpen },
    setState
  ] = useObject<State>({
    adminOpen: false,
    settingOpen: false,
    introOpen: false,
    improveOpen: false
  })
  const logOut = async () => {
    await signOut()
    dispatch(AuthActions.LOG_OUT())
  }
  const options: DropdownItemProps[] = [
    {
      key: 'intro',
      text: '소개',
      icon: 'info',
      onClick: () => {
        logEvent('소개_클릭')
        isBrowser ? push('/') : setState({ introOpen: true })
      },
      selected: false
    },
    {
      key: 'settings',
      text: '설정',
      icon: 'settings',
      onClick: () => {
        logEvent('설정_클릭')
        setState({ settingOpen: true })
      }
    },
    {
      key: 'improve',
      text: '개선점',
      icon: 'chart line',
      onClick: () => {
        logEvent('개선점_클릭')
        setState({ improveOpen: true })
      }
    },
    {
      key: 'logout',
      text: '로그아웃',
      icon: 'log out',
      onClick: () => {
        logEvent('로그아웃_클릭')
        logOut()
      }
    }
  ]
  if (uid === process.env.REACT_APP_ADMIN_ID)
    options.push({
      key: 'admin',
      text: '관리',
      icon: 'user secret',
      onClick: () => {
        logEvent('어드민_클릭')
        setState({ adminOpen: true })
      }
    })
  return (
    <>
      <section
        className="rooms__container"
        style={{ display: pathname !== '/' && !isBrowser ? 'none' : 'block' }}
      >
        <div className="rooms__logo">
          <ReLogo />
          <Dropdown
            icon={null}
            direction="left"
            options={photoURL ? options : undefined}
            onOpen={() => logEvent('프로필_클릭')}
            trigger={
              photoURL ? (
                <Image avatar src={photoURL} size="mini" />
              ) : (
                <span
                  className="login__button"
                  onClick={() => {
                    logEvent('로그인_클릭')
                    push('/login')
                  }}
                >
                  로그인
                </span>
              )
            }
          />
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ padding: 16 }}>
                <Placeholder fluid>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </div>
            ))}
          </div>
        ) : (
          <List divided verticalAlign="middle">
            {rooms.map((room, i) => {
              const lastRoom = room.chats[room.chats.length - 1]
              let lastChat = ''
              if (!lastRoom) lastChat = ''
              else if (lastRoom.message) lastChat = lastRoom.message
              else if (lastRoom.images.length) lastChat = '이미지'
              else if (lastRoom.originalCode) lastChat = '코드'
              else if (lastRoom.giphy) lastChat = '움짤'
              return (
                <Link
                  key={i}
                  className={
                    pathname === `/room/${room.id}` ? 'selected item' : 'item'
                  }
                  to={`/room/${room.id}`}
                >
                  <Image
                    avatar
                    style={{ borderRadius: 0 }}
                    src={
                      room.thumbnail ||
                      'https://react.semantic-ui.com/images/avatar/large/patrick.png'
                    }
                  />
                  <List.Content>
                    <List.Header>{room.name}</List.Header>
                    {!!room.chats.length && (
                      <List.Description>
                        {lastChat.replace(/<br \/>/g, '')}
                      </List.Description>
                    )}
                  </List.Content>
                  {!!room.chats.length && (
                    <List.Content floated="right">
                      {moment(lastRoom.createdAt).fromNow()}
                    </List.Content>
                  )}
                </Link>
              )
            })}
          </List>
        )}
      </section>
      <ReModalAdmin
        open={adminOpen}
        onClose={() => setState({ adminOpen: false })}
      />
      <ReModalSetting
        open={settingOpen}
        onClose={() => setState({ settingOpen: false })}
      />
      <ReModalIntro
        open={introOpen}
        onClose={() => setState({ introOpen: false })}
      />
      <ReModalImprove
        open={improveOpen}
        onClose={() => setState({ improveOpen: false })}
      />
    </>
  )
}

export default ReRooms
