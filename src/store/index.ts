import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import auth, { ME } from './auth'
import room from './room'
import chat from './chat'
import mention from './mention'
import setting from './setting'
import changelog from './changelog'
import bot from './bot'
import code from './code'

const reducer = {
  auth: auth.reducer,
  room: room.reducer,
  chat: chat.reducer,
  mention: mention.reducer,
  setting: setting.reducer,
  changelog: changelog.reducer,
  bot: bot.reducer,
  code: code.reducer
}

export type RootStore = typeof reducer

export const AuthActions = { ...auth.actions, ME }
export const RoomActions = room.actions
export const ChatActions = chat.actions
export const MentionActions = mention.actions
export const SettingActions = setting.actions
export const ChangelogsActions = changelog.actions
export const BotActions = bot.actions
export const CodeActions = code.actions

export default configureStore({
  reducer,
  middleware: getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production'
})
