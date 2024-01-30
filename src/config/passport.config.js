const passport = require('passport')
const local    = require('passport-local')
const GithubStrategy = require('passport-github2')
const UserDaoMongo = require('../daos/mongo/user.daomongo.js')
const { UserMongo } = require('../daos/mongo/user.daomongo.js')
const { createHash, isValidPassword } = require('../utils/hashpassword.js')
const jwt = require('passport-jwt')
const cookieParser = require('cookie-parser')

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT  = jwt.ExtractJwt
const userService   = new UserMongo()

exports.initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.a91e913153a90c89',
        clientSecret: 'a88c1be0006cdcb8a674fd7706aacbc5b9775df4',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=> {
        try {
            let user = await userService.getUserBy({email: profile._json.email})
            if (!user) {
                console.log(profile)
                let userNew = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile.email,
                    password: '123456'
                }
                let result = await userService.addUsers(userNew)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    //passport.use('register', new LocalStrategy({
    //    passReqToCallback: true,
    //    usernameField: 'email'
    //}, async (req, username, password, done) => {
    //    try{
    //        const {first_name, last_name } = req.body
    //        let userFound = await userService.getUsersByEmail(username)
    //        if (userFound) return done(null, false)
//
    //        let newUser = {
    //            first_name,
    //            last_name,
    //            email: username,
    //            password: createHash(password)
    //        }
    //        let result = await userService.addUsers(newUser)
    //        return done(null, result)
    //    } catch (error) {
    //        return done('error al crear un usuario' + error)
    //    }
    //}))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done)=>{
        let user = await userService.geUsertBy({_id: id})
        done(null, user)
    })

    //passport.use('login', new LocalStrategy({
    //    usernameField: 'email'
    //}, async (username, password, done)=>{
    //    try {
    //        const user = await userService.geUsertBy({email: username})
    //        if(!user) {
    //            console.log('User not found')
    //            return done(null, false)
    //        }
//
    //        if(!isValidPassword(password, {password: user.password})) return done(null, false)
    //        return done(null, user)
    //    } catch (error) {
    //        return done(error)
    //    }
    //}))
    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['token']
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'CoderSecretoJesonWebToken'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}