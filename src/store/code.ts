import { ICodeState } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ICodeState = {
  languages: [],
  codes: []
}

export default createSlice({
  name: 'code',
  initialState,
  reducers: {
    SET_CODES: (state, action: PayloadAction<any>) => {
      state.codes = action.payload
      state.languages = action.payload.map((item: any) => item.language)
    }
  }
})
