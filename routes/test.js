const express = require('express')
const router = express.Router()
const mime = require('mime-types')
const Multer = require('multer')
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

/* firebase firestore */
const Firestore = require('@google-cloud/firestore')
const {Storage} = require('@google-cloud/storage')

const keyFilename = 'firebase_sdk_key.json'
const projectId = 'kuis-pubg-mobile-2019'
const bucketName = `${projectId}.appspot.com`

const firestore = new Firestore({
    projectId: projectId,
    keyFilename: keyFilename
})

const document = firestore.doc('test2/something-topost')

/* firebase storage */

const gcs = new Storage({
    projectId,
    keyFilename
})

const bucket = gcs.bucket(bucketName)

const filePath = `./kuis-rule.txt`
const filePath2 = `./ic_launcher.png`
const uploadTo = `subfolder/kuis-rule.txt`
const uploadTo2 = `subfolder2/ic_launcher.png`
const fileMime = mime.lookup(filePath2)

router.get('/', (req, res, next) => {
    res.send('<h1><marquee direction=right>Hello from test</marquee></h1>')
    res.end()
})

router.post('/test2', (req, res, next) => {
    document.set({
        title: 'this is test2',
        body: 'test2 body'
    }).then(() => {
        res.json({
            "status": 200,
            "response": "Ok",
            "message": "test2 inputed"})
    })
})

router.post('/testupload', (req, res, next) => {
    /* method1 */
    bucket.upload(filePath2, {
        destination: uploadTo2,
        public: true,
        metadata: { contentType: fileMime, cacheControl: "public, max-age=300" }
    }, function(err, file) {
        if (err) {
            console.log(err)
            return
        }

        console.log(createPublicFileURL(uploadTo2))
    })
})

router.post('/testupload2', 
            multer.single('gambar'),
            sendUploadToGCS,
            (req, res, next) => {
                let data = {}

                if (req.file && req.file.cloudStoragePublicURL) {
                    data.imageURL = req.file.cloudStoragePublicURL
                }

                res.send({
                    data: data
                })
            })

/* method2 */
function sendUploadToGCS(req, res, next) {
    if (!req.file) {
        return next()
    }

    const gcsname = Date.now() + req.file.originalname;
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

/* method1 */
function createPublicFileURL(storageName) {
    return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`
}

// router.get('/test', (req, res, next) => {
//     let allUserTest = []
//     testCollection.get().then(snapshot => {
//         snapshot.forEach(doc => {
//             allUserTest.push({
//                 "docId": doc.id,
//                 "userData": doc.data()
//             })
//         })

//         res.json({
//             "status": 200,
//             "response": "Ok",
//             "message": "All test users",
//             "data": allUserTest
//         })
//     }).catch(err => {
//         console.log('Error getting documents'+err)
//     })
// })

// router.post('/test', (req, res, next) => {
//     if (req.body.name != null && req.body.email != null || req.body.name != undefined && req.body.email != undefined) {
//         let docId = Math.floor(Math.random() * (99999 - 00000))
//         let newUserTest = {
//             "name": req.body.name,
//             "email": req.body.email
//         }

//         let setNewTestUser = testCollection.doc(String(docId)).set(newUserTest)

//         res.json({
//             "message": "user test was successfully created"
//         })
//     } else {
//         res.json({
//             "message": "req.body params are undefined"
//         })
//     }
// })

module.exports = router