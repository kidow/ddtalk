import { IBotState } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IBotState = {
  menus: []
}

export default createSlice({
  name: 'bot',
  initialState,
  reducers: {
    SET_MENUS: (state, action: PayloadAction<string[]>) => {
      state.menus = action.payload || []
    }
  }
})
