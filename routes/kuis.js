const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    let data = [
        {
            "id": "question1",
            "question": "Apa nama game ini kalo anda tahu silahkan angkat kaki anda?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubgfffffffffffffffffffffffffffff",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        },
        {
            "id": "question1",
            "question": "Apa nama game ini?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubg",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        },
        {
            "id": "question1",
            "question": "Apa nama game ini?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubg",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        },
        {
            "id": "question1",
            "question": "Apa nama game iniaa?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubg",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        },
        {
            "id": "question1",
            "question": "Apa nama game iniaa?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubg",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        },
        {
            "id": "question1",
            "question": "Apa nama game iniaa?",
            "use_image": true,
            "image": "../images/hero_background.jpg",
            "correct": "pubg",
            "wrong": "dota 2",
            "wrong2": "lol",
            "wrong3": "mobalejen"
        }
    ]

    let convertedData = []
    let convertedDataInside = []
    data.forEach((question, index) => {
        convertedDataInside.push(question)

        if (convertedDataInside.length == 3) {
            convertedData.push(convertedDataInside)
            convertedDataInside = []
        }

        if (data.length % 3 != 0 && index == (data.length - 1) || (index-1) == (data.length - 2)) {
            convertedData.push(convertedDataInside)
        }
    })

    console.log(convertedData.length)

    res.render('home', { data: data})
})

router.get('/submit', (req, res, next) => {
    res.render('submit')
})

module.exports = router





























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