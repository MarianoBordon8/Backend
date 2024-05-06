const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = "CoderSecretoJesonWebToken"

const createToken = (user,expiracion) => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: expiracion})

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) res.status(401).json({stauts: 'error', error: 'not authenticated'})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_PRIVATE_KEY, (err, userDecode)=>{
        if(err) return res.status(401).json({status: 'error', error: 'not authorized'})
        req.user = userDecode
        next()
    })
}

module.exports = {
    createToken,
    authenticationToken,
    JWT_PRIVATE_KEY
}