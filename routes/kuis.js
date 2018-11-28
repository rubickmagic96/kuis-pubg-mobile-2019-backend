const express = require('express')
const router = express.Router()

const Firestore = require('@google-cloud/firestore')
const { Storage } = require('@google-cloud/storage')

const Multer = require('multer')
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const keyFilename = 'firebase_sdk_key.json'
const projectId = 'kuis-pubg-mobile-2019'
const bucketName = `${projectId}.appspot.com`
const firestore = new Firestore({
    projectId: projectId,
    keyFilename: keyFilename
})
const document = firestore.doc('test2/something-topost')
const bucket = gcs.bucket(bucketName)






























// const Firestore = require('@google-cloud/firestore')
// const {Storage} = require('@google-cloud/storage')
// const Multer = require('multer')

// const projectId = 'kuis-pubg-mobile-2019'
// const keyFilename = 'kuis-pubg-mobile-2019-firebase-adminsdk-o22oe-87b1afd909.json'
// const bucketName = 'kuis-pubg-mobile-2019.appspot.com'

// const firestore = new Firestore({
//     projectId: projectId,
//     keyFilename: keyFilename
// })
// const storage = new Storage({
//     projectId: projectId
// })
// // /const document = firestore.doc('test2/something-topost')

// const bucket = storage.bucket(bucketName)

// const multer = Multer({
//     storage: Multer.MemoryStorage,
//     limits: {
//         fileSize: 5 * 1024 * 1024
//     }
// })

// const uploadImageToStorage = (file) => {
//     let prom = new Promise((resolve, reject) => {
//         if (!file) {
//             reject('No image file')
//         }
//         let newFileName = `${Date.now()}_${file.originalname}`
//         console.log(file.mimetype)
//         let fileupload = bucket.file(newFileName)

//         const blobStream = fileupload.createWriteStream({
//             metadata: {
//                 contentType: file.mimetype
//             },
//             resumable:false
//         })

//         blobStream.on('error', (error) => {
//             reject('the error: '+error)
//         })

//         blobStream.on('finish', () => {
//             const url = format(`https://storage.googleapis.com/${bucket.name}/${fileupload.name}`)
//             resolve(url)
//         })

//         blobStream.end(file.buffer)
//     })

//     return prom
// }

// router.get('/', (req, res) => {
//     res.render('kuis')
// })

// router.post('/test/image-uploader', multer.single('gambar') ,(req, res) => {
//     console.log('uploading image...')

//     let file = req.file
//     if (file) {
//         uploadImageToStorage(file).then((success) => {
//             res.status(200).send({
//                 status: 'success'
//             })
//         }).catch((error) => {
//             console.log(error)
//         })
//     }
// })

module.exports = router