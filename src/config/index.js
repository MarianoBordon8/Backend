const { connect } = require('mongoose')

exports.connectdb = async () => {
    await connect('mongodb+srv://MarianoBordon:Gabrielito2010.@cluster0.xgzgfd5.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('Base de datos conectada')
}