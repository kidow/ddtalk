import { IChangelogState, ITimeline } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IChangelogState = {
  changelogs: []
}

export default createSlice({
  name: 'changelog',
  initialState,
  reducers: {
    SET_CHANGELOGS: (state, action: PayloadAction<ITimeline[]>) => {
      state.changelogs = action.payload
    }
  }
})
