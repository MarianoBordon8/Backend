const cluster = require('cluster')
const { cpus } = require('os')
const { serverHttp } = require("./src/server")
const { logger } = require('./src/utils/logger')

// logger.info('Proceso is Primaty: ' + cluster.isPrimary)

const numeroDeProcesadores = cpus().length
// logger.info(numeroDeProcesadores)


if (cluster.isPrimary) {
    logger.info('proceso primario, que va a generar workers')
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork()
    }
    cluster.on('message', worker => {
        logger.info(`Mensaje recibido del worker: ${worker.process.pid}`)
    })
}else{
    logger.info('wolker, no soy un primario')
    logger.info(`wolker con id: ${process.pid}`)
    serverHttp()
}