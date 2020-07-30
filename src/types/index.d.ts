export * from './store'
export * from './api'

export interface IMention {
  username: string
  avatar: string
  uid: string
  fcm_token: string
}

export interface IRoom {
  id: string
  name: string
  createdAt: string
  thumbnail: string
  chats: IChat[]
}

export interface IChat {
  createdAt: string
  message: string
  avatar: string
  roomId: string
  userId: string
  username: string
  originalCode: string
  modifiedCode: string
  images: any
  language: string
  mentions: IMention[]
  commands: string[]
  giphy: string
  fcm_token: string
}

export interface IModal {
  open: boolean
  onClose: () => void
}

export type Language =
  | 'c'
  | 'cpp'
  | 'c++'
  | 'c#'
  | 'csharp'
  | 'css'
  | 'dart'
  | 'dockerfile'
  | 'go'
  | 'graphql'
  | 'html'
  | 'java'
  | 'javascript'
  | 'json'
  | 'kotlin'
  | 'less'
  | 'markdown'
  | 'mysql'
  | 'objective-c'
  | 'php'
  | 'powershell'
  | 'pug'
  | 'python'
  | 'r'
  | 'ruby'
  | 'rust'
  | 'scss'
  | 'shell'
  | 'sql'
  | 'svelte'
  | 'swift'
  | 'typescript'
  | 'visual basic'
  | 'vb'
  | 'vue'
  | 'xml'
  | 'yaml'
  | string

export interface ITimeline {
  year: string
  month: string
  day: string
  title: string
  descriptions: Array<{ text: string; optional?: string }>
}

export interface ISentry {
  type: string
  status?: number
  message?: string
  data?: any
  params?: any
  err?: any
  url?: string
}

export interface IMessaging {
  to: string
  notification: {
    title: string
    body: string
    icon: string
  }
  webpush: {
    fcm_options: {
      link: string
    }
  }
}
