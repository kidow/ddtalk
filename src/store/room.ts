import { IRoomState, IRoom, IChat } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IRoomState = {
  title: '',
  loading: true,
  rooms: []
}

export default createSlice({
  name: 'room',
  initialState,
  reducers: {
    INITIALIZE: () => initialState,
    SET_ROOMS: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload
    },
    ADD_CHAT: (state, action: PayloadAction<IChat>) => {
      const index = state.rooms.findIndex(
        (item) => item.id === action.payload.roomId
      )
      if (index === -1) return
      state.rooms[index].chats.push(action.payload)
      const renewalRoom = state.rooms[index]
      state.rooms = [
        renewalRoom,
        ...state.rooms.slice(0, index),
        ...state.rooms.slice(index + 1)
      ]
    },
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})
