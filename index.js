const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseConfig = require('./firebase-config.json')

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: 'https://ddtalk-65a8c.firebaseio.com',
  storageBucket: 'ddtalk-65a8c.appspot.com'
})

const currentTimestamp = new Date().getTime()

// 일시 중단.
// exports.onDeleteChat = functions
//   .region('asia-northeast1')
//   .firestore.document('/chat/{id}')
//   .onCreate(async () => {
//     const firestore = admin.firestore()
//     const chats = await firestore.collection('chat').get()
//     chats.forEach(async (doc) => {
//       const data = doc.data()
//       if (data.createdAt + 86400 * 1000 < currentTimestamp) {
//         await firestore.collection('chat').doc(doc.id).delete()
//       }
//     })
//   })

exports.scheduler = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 5 minutes')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    // 하루 지난 채팅 삭제
    const firestore = admin.firestore()
    const chats = await firestore.collection('chat').get()
    chats.forEach(async (doc) => {
      const data = doc.data()
      if (data.createdAt + 86400 * 1000 * 7 < currentTimestamp) {
        await firestore.collection('chat').doc(doc.id).delete()
      }
    })

    // // 일주일 지난 이미지 삭제
    // const bucket = admin.storage().bucket('image')

    // const get = await bucket.get()
    // get.console.log('get', get)
    // const [images] = await bucket.getFiles()
    // console.log('images', images)
    // images.forEach(async (item) => {
    //   const file = await item.getMetadata()
    //   console.log('file', file)
    // })
  })
