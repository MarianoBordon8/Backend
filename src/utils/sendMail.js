const nodemailer = require('nodemailer')
const { configObject } = require('../config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_pass_app
    }
})

exports.sendMail = async (destinatario, subject, html)=> {
    return await transport.sendMail({
        from: 'Este mail lo envia <<bordon.marianooscar@gmail.com>>',
        to: destinatario,
        subject,
        html
    })
}