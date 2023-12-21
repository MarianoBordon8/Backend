const socket = io()


const messages = document.querySelector('#messages')
let user
let mensaje
let email

Swal.fire({
    title: 'Identificate',
    text: 'Ingrese el usuario',
    input: 'text',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Escriba un nombre de usuario'
    }
}).then(result =>{
    user = result.value
})

document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault()
    mensaje = document.getElementById("chatBox").value
    email = document.getElementById("chatUser").value
    if(mensaje.trim().length > 0){
        socket.emit('message', {user: email, message: mensaje})
        mensaje = ''
    }
})

socket.on('messageLogs', data => {
    let messageLog = ''
    data.forEach(elm => {
        messageLog += `
            <div class="log">
                <p class="user">email: ${elm.user}</p>
                <p class="text">${elm.message}</p>
                <hr>
            </div>
        `
    })

    messages.innerHTML = messageLog
})