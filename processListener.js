const { logger } = require("./src/utils/logger")

process.on('exit', code => {
    logger.info('Evento que se ejecuta antes de salir del proceso: ', code)
})
process.on('uncaughtException', exception => {
    logger.info('captura todos los errores no controlados, algo mal escrito o que no esté definido: ', exception)
})

logger.info('ejecutando alguna sentencia')