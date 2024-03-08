const passport = require('passport')
const GithubStrategy = require('passport-github2')
const jwt = require('passport-jwt')
const UserDaoMongo = require('../daos/mongo/user.daomongo.js')
const { logger } = require('../utils/logger.js')

const JWTStrategy = jwt.Strategy
const ExtractJWT  = jwt.ExtractJwt
const userService   = new UserDaoMongo()



exports.initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.a91e913153a90c89',
        clientSecret: 'a88c1be0006cdcb8a674fd7706aacbc5b9775df4',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=> {
        try {
            let user = await userService.getBy({email: profile._json.email})
            if (!user) {
                logger.info(profile)
                let userNew = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile.email,
                    password: '123456'
                }
                let result = await userService.create(userNew)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            return done(error)
        }
    }))


    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done)=>{
        let user = await userService.getBy({_id: id})
        done(null, user)
    })

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