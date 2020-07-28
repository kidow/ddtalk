import axios from 'axios'

interface IGipfyQuery {
  q: string
  limit?: number
  offset?: number
  rating?: string
}

const api_key = process.env.REACT_APP_GIPHY_KEY
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/'

const giphy = axios.create({
  baseURL: GIPHY_BASE_URL
})

export const getGifs = (params: IGipfyQuery) =>
  giphy({ url: 'gifs/search', params: { ...params, api_key, lang: 'ko' } })

export const getStickers = (params: IGipfyQuery) =>
  giphy({ url: 'stickers/search', params: { ...params, api_key, lang: 'ko' } })
