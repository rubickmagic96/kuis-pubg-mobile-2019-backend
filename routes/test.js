const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const serviceAcc = require('../kuis-pubg-mobile-2019-firebase-adminsdk-o22oe-87b1afd909.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAcc)
})

const db = admin.firestore()
const testCollection = db.collection('test')

router.get('/', (req, res, next) => {
    res.send('<h1><marquee direction=right>Hello from test</marquee></h1>')
    res.end()
})

router.get('/test', (req, res, next) => {
    let allUserTest = []
    testCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            allUserTest.push({
                "docId": doc.id,
                "userData": doc.data()
            })
        })

        res.json({
            "status": 200,
            "response": "Ok",
            "message": "All test users",
            "data": allUserTest
        })
    }).catch(err => {
        console.log('Error getting documents'+err)
    })
})

router.post('/test', (req, res, next) => {
    if (req.body.name != null && req.body.email != null || req.body.name != undefined && req.body.email != undefined) {
        let docId = Math.floor(Math.random() * (99999 - 00000))
        let newUserTest = {
            "name": req.body.name,
            "email": req.body.email
        }

        let setNewTestUser = testCollection.doc(String(docId)).set(newUserTest)

        res.json({
            "message": "user test was successfully created"
        })
    } else {
        res.json({
            "message": "req.body params are undefined"
        })
    }
})

module.exports = router