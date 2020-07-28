import jsCookie from 'js-cookie'
import { createDoc } from 'services'

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
  })
}

export const dataURLtoFile = (dataurl: string) => {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)![1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], new Date().getTime().toString(), { type: mime })
}

export const cookieSet = (name: string, value: string | object) =>
  jsCookie.set(name, value, {
    expires: 365,
    domain: process.env.NODE_ENV === 'production' ? '.ddtalk.tk' : 'localhost'
  })

export const callBot = (id: string) =>
  createDoc('chat', {
    message:
      "안녕하세요!👋 디디봇입니다. '#' 뒤에 다음과 같은 명령어를 입력해 보세요. 저는 '#디디봇'을 치면 부를 수 있습니다.",
    roomId: id,
    userId: 'ddbot',
    username: '디디봇',
    avatar: '/ddbot.svg',
    language: '',
    images: [],
    mentions: [],
    commands: ['#메뉴추천'],
    fcm_token: ''
  })
