import { StrictCommentGroupProps } from 'semantic-ui-react'
import { IRoom, IMention, ITimeline, Language } from 'types'

export interface IAuthState {
  open: boolean
  isFetched: boolean
  nickname: string
  isLoggedIn: boolean
  uid: string
  photoURL: string
  email: string
}

export interface ISettingState {
  size: StrictCommentGroupProps['size']
  fcm_token: string
}

export interface IRoomState {
  title: string
  loading: boolean
  rooms: IRoom[]
}

export interface IChatState {
  images: string[]
  message: string
  mentions: IMention[]
  code: string
  language: string
  modifiedCode: string
  originalCode: string
  term: string
}

export interface IChangelogState {
  changelogs: ITimeline[]
}

export interface IBotState {
  menus: string[]
}

export interface ICodeState {
  languages: Language[]
  codes: Array<{
    language: Language
    code: string
  }>
}
