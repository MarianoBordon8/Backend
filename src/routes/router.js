const { Router } = require('express')
const { authorize } = require('passport')

class RouterCustom {
    constructor(){
        this.Router = Router()
        this.init()
    }

    getRouter(){
        return this.Router
    }

    init(){}

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = plyload => res.send({status: 'success', plyload})
        res.sendServerError = error => res.status(500).send({status: 'error', error})
        res.sendUserError = error => res.status(400).send({status: 'error', error})
        next()
    }

    applyCallbacks(callbacksArray){
        return callbacksArray.map(callback => async (...params)=>{
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error)
                params[1].status(500).send(error)
            }
        })
    }

    handlePolicies = policies => (req, res, next) => {
        if(policies[0] === 'PUBLIC') return next()
        const authheaders = req.headers.authorization
        if(!authheaders) return res.status(401).send({status: 'error', plyload: 'unauthorized'})
        const token = authheaders.split(' ')[1]
        let user = jwt.verify(token, "CoderSecretoJesonWebToken")
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status: 'error', error: 'not permissions'})
        req.user = user
        next()
    }

    get(path, policies, ...callbacks){
        return this.Router.get(path, this.handlePolicies(policies) ,this.generateCustomResponses ,this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks){
        return this.Router.post(path, this.handlePolicies(policies) ,this.generateCustomResponses ,this.applyCallbacks(callbacks))
    }
    put(path, policies, ...callbacks){
        return this.Router.put(path, this.handlePolicies(policies) ,this.generateCustomResponses ,this.applyCallbacks(callbacks))
    }
    delete(path, policies, ...callbacks){
        return this.Router.delete(path, this.handlePolicies(policies) ,this.generateCustomResponses ,this.applyCallbacks(callbacks))
    }
}

module.exports = RouterCustom