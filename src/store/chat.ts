import { IChatState } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IChatState = {
  images: [],
  message: '',
  mentions: [],
  code: '',
  language: '',
  modifiedCode: '',
  originalCode: '',
  term: 'developer'
}

export default createSlice({
  name: 'chat',
  initialState,
  reducers: {
    INITIALIZE: () => initialState,
    INITIALIZE_CODE: (state) => {
      state.code = ''
      state.originalCode = ''
      state.modifiedCode = ''
    },
    SET_TERM: (state, action: PayloadAction<string>) => {
      state.term = action.payload
    },
    SET_CHAT: (state, action: PayloadAction<Partial<IChatState>>) => {
      const {
        images,
        message,
        mentions,
        code,
        language,
        modifiedCode,
        originalCode
      } = action.payload
      if (images) state.images = images
      if (message !== undefined) state.message = message
      if (mentions) state.mentions = mentions
      if (code) state.code = code
      if (language) state.language = language
      if (modifiedCode !== undefined) state.modifiedCode = modifiedCode
      if (originalCode) state.originalCode = originalCode
    },
    SET_MODIFIED_CODE: (state, action: PayloadAction<string>) => {
      state.modifiedCode = action.payload
    },
    SET_CODE: (state, action: PayloadAction<string>) => {
      state.code = action.payload
    },
    SET_MESSAGE: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
    SET_ORIGINAL_CODE: (state, action: PayloadAction<string>) => {
      state.originalCode = action.payload
    }
  }
})
