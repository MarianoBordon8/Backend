const generateUserErrorInfo = (user) =>{
    return `One or more properties were incomplete or not valid.
    list of require properties:
    *firts_name: nedds to be a String, recived ${user.firts_name }
    *last_name: nedds to be a String, recived ${user.last_name }
    *email: nedds to be a String, recived ${user.email }
    `
}

module.exports = {
    generateUserErrorInfo
}