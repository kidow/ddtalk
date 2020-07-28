import { IMention } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IMention = {
  uid: '',
  username: '',
  avatar: '',
  fcm_token: ''
}

export default createSlice({
  name: 'mention',
  initialState,
  reducers: {
    INITIALIZE: () => initialState,
    SET_MENTION: (state, action: PayloadAction<IMention>) => {
      const { username, uid, avatar, fcm_token } = action.payload
      state.username = username
      state.uid = uid
      state.avatar = avatar
      state.fcm_token = fcm_token
    }
  }
})
