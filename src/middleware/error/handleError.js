const { Errors } = require("../../services/errors/enums");
const { logger } = require("../../utils/logger");

exports.handleError = (err, req, res, next) => {
    switch (err.code) {
        case Errors.INVALID_TYPES:
            logger.error(err)
            return res.status(400).send({status: 'error', error: err.mesagge})
            break;
    
        default:
            return res.status(500).send({status: 'error', error: 'Error Server'})
            break;
    }
}