exports.authorization = roleArray => {
    return async (req, res, next)=>{
        try {
            if (!req.session.user) return res.status(401).send({status: 'error', message: 'Unauthorized'})
            if(!roleArray.includes(req.session.user.role.toUpperCase())) return res.status(403).send({status: 'error', message: 'Not permissions'})
            next()
        } catch (error) {
            next(error)
        }
    }
}