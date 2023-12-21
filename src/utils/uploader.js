const multer = require('multer')
const {dirname} = require('node:path')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${dirname(__dirname)}/public/uploader`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({
    storage,
    onError: function (error, next) {
        console.log(error)
        next()
    }
})

module.exports = {
    uploader
}