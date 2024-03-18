const { Command } = require('commander')
const { logger } = require('./logger')

const program = new Command()

program
    .option('-d', 'VAriables para debug', false)
    .option('-p <port>', 'puerto del servidor', 4000)
    .option('-u <user>', 'usuario del proceso')
    .option('--mode <mode>', 'especifíca el entrono de ejecución de nuestra server', 'development')
    .option('-l, --letter [letter...]', 'specify letter')

program.parse()

module.exports = {
    program
}