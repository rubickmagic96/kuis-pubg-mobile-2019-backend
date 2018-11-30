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
const gcs = new Storage({
    projectId,
    keyFilename
})

const bucket = gcs.bucket(bucketName)

router.get('/', (req, res, next) => {
    const document = firestore.collection('quiz')
    document.get().then(dataquiz => {
        let data = []

        dataquiz.forEach(doc => {
            data.push(doc.data())
        })

        console.log(data)

        return data
    }).then(data => {
        let convertedData = []
        let convertedDataInside = []
        data.forEach((question, index) => {
            convertedDataInside.push(question)

            if (convertedDataInside.length == 3) {
                convertedData.push(convertedDataInside)
                convertedDataInside = []
            }

            if (data.length % 3 != 0 && index == (data.length - 1) || (index - 1) == (data.length - 2) && convertedDataInside.length != 0) {
                convertedData.push(convertedDataInside)
            }
        })

        console.log(convertedData.length)

        res.render('home', { data: convertedData })
    })
})

router.get('/submit', (req, res, next) => {
    let questionNumber
    const document = firestore.collection('quiz')

    // data.forEach((doc) => {
        //     console.log(doc.data())
        // })

    document.get().then(data => {
        questionNumber = data.size
        questionNumber++

        res.render('submit', { currentQuestion: questionNumber })
    })
})

router.post('/submit', 
    multer.single('image'),
    sendUploadToGCS,
    (req, res, next) => {

    let data = req.body
    const document = firestore.doc(`quiz/${data.quiz_id}`)

    if (data.use_image === 'false') {
        document.set({
            id: data.quiz_id,
            question: data.question,
            use_image: data.use_image,
            correct_answer: data.correct_answer,
            wrong_answer1: data.wrong_answer1,
            wrong_answer2: data.wrong_answer2,
            wrong_answer3: data.wrong_answer3
        }).then(() => {
            res.redirect('/kuis/')
        })   
    } else if (data.use_image === 'true') {
        if (req.file && req.file.cloudStoragePublicURL) {
            document.set({
                id: data.quiz_id,
                question: data.question,
                use_image: data.use_image,
                image: req.file.cloudStoragePublicURL,
                correct_answer: data.correct_answer,
                wrong_answer1: data.wrong_answer1,
                wrong_answer2: data.wrong_answer2,
                wrong_answer3: data.wrong_answer3
            }).then(() => {
                res.redirect('/kuis/')
            })
        }
    }
})

function sendUploadToGCS(req, res, next) {
    if (!req.file) {
        console.log('no image')
        return next()
    }

    console.log('image exists')

    const gcsname = Date.now() +'_'+ req.file.originalname;
    const file = bucket.file(gcsname)
    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        },
        resumable: false
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        file.makePublic().then(() => {
            req.file.cloudStoragePublicURL = getPublicUrl(gcsname)
            next()
        })
    })

    stream.end(req.file.buffer)
}

function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${bucketName}/${filename}`
}

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