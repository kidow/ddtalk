import 'dotenv/config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/messaging'
import { captureException, toastError } from 'services'
import moment from 'moment'

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_MEASUREMENT_ID,
  REACT_APP_APP_ID
} = process.env

const config = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID
}

if (!firebase.apps.length) firebase.initializeApp(config)

export const authError = (code: string) => {
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      toastError('이미 가입한 계정이 있습니다.')
    default:
  }
}

export const onAuthStateChanged = (): Promise<firebase.User | null> => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(
      (user) => resolve(user),
      (err) => {
        captureException({ err, type: 'onAuthStateChanged error' })
        reject(err)
      }
    )
  })
}

export const signOut = () =>
  new Promise((resolve, reject) =>
    firebase
      .auth()
      .signOut()
      .then(resolve)
      .catch((err) => {
        captureException({ type: 'signOut error', err })
        reject(err)
      })
  )

export const upload = async ({
  file,
  child
}: {
  file: File
  child: string
}): Promise<string | Error | undefined> => {
  const user = await onAuthStateChanged()
  if (!user) return
  const metaData = { contentType: file.type }
  const storage = firebase.storage()
  const storageReg = storage.ref().child(child).put(file, metaData)

  return new Promise((resolve, reject) => {
    storageReg.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused')
            break

          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running')
            break

          default:
        }
      },
      (err) => {
        captureException({ err, type: 'upload error' })
        return reject(err)
      },
      async () => {
        try {
          const downloadURL: string = await storageReg.snapshot.ref.getDownloadURL()
          // await deleteImage()
          resolve(downloadURL)
        } catch (err) {
          captureException({ err, type: 'upload error' })
          reject(err)
        }
      }
    )
  })
}

export const deleteImage = async () => {
  try {
    const storage = firebase.storage()
    const res = await storage.ref().child('image').listAll()
    res.prefixes.forEach(async (date) => {
      const list = await date.listAll()
      list.items.forEach(async (item) => {
        if (moment(Number(item.name)).isBefore(moment().add(-7, 'days')))
          await item.delete()
      })
    })
  } catch (err) {
    console.log(err)
  }
}

export const googleLogin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      logEvent('구글_로그인_클릭')
      await firebase.auth().signInWithRedirect(provider)
      resolve()
    } catch (err) {
      authError(err.code)
      captureException({ type: 'googleLogin error', err })
      reject(err)
    }
  })
}

export const getRedirectResult = (): Promise<firebase.auth.UserCredential> =>
  new Promise((resolve, reject) =>
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => resolve(result))
      .catch((err) => {
        captureException({ type: 'getRedirectResult error', err })
        reject(err)
      })
  )

export const createDoc = (collection: 'chat' | 'rooms', data: any) =>
  new Promise((resolve, reject) =>
    firebase
      .firestore()
      .collection(collection)
      .add({ ...data, createdAt: new Date().getTime() })
      .then(resolve)
      .catch((err) => {
        captureException({ type: 'createDoc error', err })
        reject(err)
      })
  )

export const deleteUser = () =>
  new Promise((resolve, reject) =>
    firebase
      .auth()
      .currentUser?.delete()
      .then(() => {
        logEvent('회원_탈퇴')
        resolve()
      })
      .catch((err) => {
        captureException({ type: 'deleteUser error', err })
        reject(err)
      })
  )

export const updateDoc = (
  collection: 'chat' | 'rooms',
  id: string,
  data: any
) =>
  new Promise((resolve, reject) =>
    firebase
      .firestore()
      .collection(collection)
      .doc(id)
      .update(data)
      .then(resolve)
      .catch((err) => {
        captureException({ type: 'updateDoc error', err })
        reject(err)
      })
  )

export const logEvent = (
  eventName: string,
  eventParams?: { [key: string]: any },
  options?: firebase.analytics.AnalyticsCallOptions
) => firebase.analytics().logEvent(eventName, eventParams, options)

export const setUserId = (
  id: string,
  options?: firebase.analytics.AnalyticsCallOptions
) => firebase.analytics().setUserId(id, options)

export const setUserProperties = (
  properties: firebase.analytics.CustomParams
) => firebase.analytics().setUserProperties(properties)

export const requestPermission = () => firebase.messaging().requestPermission()

export const getToken = () => firebase.messaging().getToken()

export const githubLogin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new firebase.auth.GithubAuthProvider()
      logEvent('깃허브_로그인_클릭')
      await firebase.auth().signInWithRedirect(provider)
      resolve()
    } catch (err) {
      authError(err.code)
      captureException({ type: 'githubLogin error', err })
      reject(err)
    }
  })
}

export const facebookLogin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new firebase.auth.FacebookAuthProvider()
      logEvent('페이스북_로그인_클릭')
      await firebase.auth().signInWithRedirect(provider)
      resolve()
    } catch (err) {
      authError(err.code)
      captureException({ type: 'facebookLogin error', err })
      reject(err)
    }
  })
}

export const deleteToken = (token: string) =>
  firebase.messaging().deleteToken(token)

export const onMessage = (
  nextOrObserver: firebase.NextFn<any> | firebase.Observer<any>
) => firebase.messaging().onMessage(nextOrObserver)

export const setBackgroundMessageHandler = (
  callback: (payload: any) => Promise<any> | void
) => firebase.messaging().setBackgroundMessageHandler(callback)
