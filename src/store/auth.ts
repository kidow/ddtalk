import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { IAuthState } from 'types'
import { onAuthStateChanged, setUserId, setUserProperties } from 'services'

const initialState: IAuthState = {
  uid: '',
  nickname: '',
  photoURL: '',
  open: false,
  isFetched: false,
  isLoggedIn: false,
  email: ''
}

export const ME = createAsyncThunk('auth/ME', onAuthStateChanged)

export default createSlice({
  name: 'auth',
  initialState,
  reducers: {
    INITIALIZE: () => initialState,
    LOG_OUT: (state) => {
      state.uid = ''
      state.nickname = ''
      state.photoURL = ''
      state.isLoggedIn = false
      state.email = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(ME.fulfilled, (state, action) => {
        if (!action.payload) return
        const { email, uid, photoURL } = action.payload
        if (email) {
          state.nickname = email.substr(0, email.indexOf('@'))
          state.email = email
        }
        state.uid = uid
        if (photoURL) state.photoURL = photoURL
        state.isFetched = true
        state.isLoggedIn = !!uid
        setUserId(uid)
        setUserProperties({ email })
      })
      .addCase(ME.rejected, (state) => {
        state.isFetched = true
      })
  }
})
