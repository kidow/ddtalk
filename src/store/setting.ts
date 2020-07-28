import { ISettingState } from 'types'
import jsCookie from 'js-cookie'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

let initialState: ISettingState = {
  size: 'small',
  fcm_token: ''
}

const settings = jsCookie.get('setting')

if (settings) initialState = JSON.parse(settings)

export default createSlice({
  name: 'setting',
  initialState,
  reducers: {
    INITIALIZE: () => initialState,
    SET_SETTING: (state, action: PayloadAction<Partial<ISettingState>>) => {
      const { size, fcm_token } = action.payload
      if (size) state.size = size
      if (fcm_token) state.fcm_token = fcm_token
    }
  }
})
