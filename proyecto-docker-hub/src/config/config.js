const {connect} = require("mongoose")
require('dotenv').config()

const mongo_url = process.env.MONGO_URL || 'mongodb+srv://MarianoBordon:GabrielitoMongodbatlas@cluster0.xgzgfd5.mongodb.net/ecommerce?retryWrites=true&w=majority'
// console.log('mongo_url: ', mongo_url)
module.exports = {
    dbConection: async ()=>{
        try {
            const conectDB = await connect(mongo_url)
            console.log(`DB conected`)
        } catch (error) {
            console.log(error)
        }
    }
}

// defe014/imagen:version
// docker tag userscreator defe014/userscreator:1.0.0
// docker push defe014/userscreator:1.0.0

// kubectl
// curl.exe -LO "https://dl.k8s.io/release/v1.25.0/bin/windows/amd64/kubectl.exe"
// kubectl version --short

// minikube
// https://minikube.sigs.k8s.io/docs/start/ -> descarga

// kubectl cluster-info