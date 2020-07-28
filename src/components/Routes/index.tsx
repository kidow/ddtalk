import * as React from 'react'
import { useEffect } from 'react'
import routes from 'pages'
import {
  Route,
  Switch,
  RouteProps,
  RouteComponentProps
} from 'react-router-dom'
import { ReNotFound } from 'components'
import './index.scss'
import firebase from 'firebase/app'
import { IChat, IBotState, IChangelogState } from 'types'
import { useDispatch } from 'react-redux'
import { RoomActions, ChangelogsActions, BotActions, CodeActions } from 'store'
import { logEvent, getChangelogs, getBot, useStore, getCodes } from 'services'

export interface Props {}

const ReRoutes: React.FunctionComponent<Props> = () => {
  const Routes = ({
    component: Component,
    ...rest
  }: RouteProps): JSX.Element => (
    <Route
      {...rest}
      // @ts-ignore
      render={(props: RouteComponentProps<any>) => <Component {...props} />}
    />
  )
  const dispatch = useDispatch()
  const { menus } = useStore<IBotState>('bot')
  const { changelogs } = useStore<IChangelogState>('changelog')
  const setRooms = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const roomsRef = await firebase.firestore().collection('rooms').get()
        let rooms: any[] = []
        roomsRef.forEach((room) => {
          let data = room.data()
          let id = room.id
          rooms.push({ id, chats: [], ...data })
        })
        dispatch(RoomActions.SET_ROOMS(rooms))
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }
  const onSnapshot = () => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('chat')
        .where('createdAt', '>=', new Date().getTime() - 86400 * 1000 * 7)
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            let data = change.doc.data() as IChat
            data.message = data.message.replace(/\n/g, '<br />')
            dispatch(RoomActions.ADD_CHAT(data))
            logEvent('채팅_스냅샷', { room_id: data.roomId })
            resolve()
          })
        }, reject)
    })
  }
  const get = async () => {
    await setRooms()
    await onSnapshot()
    getLogs()
    getBotMenus()
    getSampleCodes()
    dispatch(RoomActions.SET_LOADING(false))
  }
  const getLogs = async () => {
    if (changelogs.length) return
    const data = await getChangelogs()
    dispatch(ChangelogsActions.SET_CHANGELOGS(data))
  }
  const getBotMenus = async () => {
    if (menus.length) return
    const data = await getBot('메뉴추천')
    dispatch(BotActions.SET_MENUS(data))
  }
  const getSampleCodes = async () => {
    const data = await getCodes()
    dispatch(CodeActions.SET_CODES(data))
  }
  useEffect(() => {
    get()
  }, [])
  return (
    <div className="main__container">
      <Switch>
        {routes.map(({ path, component }, i) => (
          <Routes
            key={i}
            exact
            strict
            path={path}
            component={component.default}
          />
        ))}
        <Routes component={ReNotFound} />
      </Switch>
    </div>
  )
}

export default ReRoutes
