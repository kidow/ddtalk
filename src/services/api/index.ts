import axios, { AxiosError, AxiosResponse } from 'axios'
import { captureException } from 'services'
import { ISentry, IMessaging, SendImprove } from 'types'

const request = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const apiCapture = (err: AxiosError, type: string) => {
  let options: ISentry = {
    err,
    type,
    message: err.message
  }
  if (err.config.data) options.data = err.config.data
  if (err.config.params) options.params = err.config.params
  captureException(options)
}

request.interceptors.request.use(
  (config) => config,
  (err) => {
    apiCapture(err, 'request interceptor error')
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  ({ data }: AxiosResponse) => data,
  (err: AxiosError) => {
    apiCapture(err, 'response interceptor error')
    return Promise.reject(err)
  }
)

export const getChangelogs = () =>
  request({ url: '/changelogs' }) as Promise<any>
export const getCodes = () => request({ url: '/codes' }) as Promise<any>
export const getBot = (command: string) =>
  request({ url: '/bots', params: { command } }) as Promise<any>

export const sendMessage = (data: IMessaging, token: string) =>
  axios({
    method: 'post',
    url: `https://fcm.googleapis.com/v1/projects/${process.env.REACT_APP_PROJECT_ID}/messages:send`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data
  }) as Promise<any>
