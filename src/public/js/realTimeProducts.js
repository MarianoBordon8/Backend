const socket = io()

let bandera = 'ninguno'

const agregar = document.getElementById('agregar')
const eliminar = document.getElementById('eliminar')
const mensajesDiv = document.getElementById('formulario')

function agregarprod(){
    const formularioDelete = document.getElementById("formularioDelete")
    if(formularioDelete !== null){
        formularioDelete.remove()
    }
    const formularioAdd = document.createElement('form')
    formularioAdd.id = 'formularioAdd'
    formularioAdd.innerHTML = `
        <label for="nombre">Titulo:</label>
        <input type="text" id="titulo" name="titulo">
        <br>
        <label for="nombre">Descripcion:</label>
        <input type="text" id="descripcion" name="descripcion">
        <br>
        <label for="nombre">Codigo:</label>
        <input type="text" id="codigo" name="codigo">
        <br>
        <label for="nombre">Precio:</label>
        <input type="text" id="precio" name="precio">
        <br>
        <label for="nombre">Stock:</label>
        <input type="text" id="stock" name="stock">
        <br>
        <label for="nombre">Ruta:</label>
        <input type="text" id="Ruta" name="Ruta">
        <br>
        <button type="submit" value="Enviar" id="botonAdd">Enviar</button>
    `
    document.body.appendChild(formularioAdd)
    const botonAdd = document.getElementById('botonAdd')
    botonAdd.addEventListener('click', function(event) {
        event.preventDefault()
        const title = document.getElementById('titulo').value
        const description = document.getElementById('descripcion').value
        const price = parseInt(document.getElementById('precio').value)
        const thumbnail = document.getElementById('Ruta').value
        const code = document.getElementById('codigo').value
        const stock = parseInt(document.getElementById('stock').value)
        const objeto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock:stock
        }
        socket.emit('enviar-contenido-producto', objeto)
        document.getElementById('titulo').value = ""
        document.getElementById('descripcion').value = ""
        document.getElementById('codigo').value = ""
        document.getElementById('precio').value = ""
        document.getElementById('stock').value = ""
        document.getElementById('Ruta').value = ""
    })
}

function eliminarprod(){
    const formularioAdd = document.getElementById("formularioAdd")
    if(formularioAdd !== null){
        formularioAdd.remove()
    }
    const formularioDelete = document.createElement('form')
    formularioDelete.id = 'formularioDelete'
    formularioDelete.innerHTML = `
    <label for="nombre">id producto a eliminar:</label>
    <input type="text" id="idEliminar" name="idEliminar">
    <button type="submit" value="Enviar" id="botonDelete">Enviar</button>
    `
    document.body.appendChild(formularioDelete)
    botonDelete.addEventListener('click', function(event) {
        event.preventDefault()
        const id = document.getElementById('idEliminar').value
        socket.emit('enviar-id-producto', id)
    })
}

agregar.addEventListener('click', function(){
    bandera = 'agregar'
    mostrarFormulario()
})

eliminar.addEventListener('click', function(){
    bandera = 'eliminar'
    mostrarFormulario()
})

function mostrarFormulario(){
    if (bandera === 'agregar'){
        agregarprod()
    }
    if(bandera === 'eliminar'){
        eliminarprod()
    }
}


socket.on('cargar-productos', products =>{
    let card
    const productList = document.querySelector('#productos')
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild)
    }
    if(products.length === 0){
        card = document.createElement("div")
        card.classList.add(`card`)
        card.innerHTML= `
                <h1>No tienes productos</h1>
            `
            productList.appendChild(card)
    }else{
        products.forEach((product) => {
            card = document.createElement("div")
            card.classList.add(`card`)
            card.innerHTML= `
                <p>id del producto: ${product.id}</p>
                <p>Imagen ${product.thumbnail} </p>
                <h2>Nombre del producto: ${product.title}</h2>
                <h3>Precio: ${product.price}</h3>
                <p>stock: ${product.stock}</p>
                <p>Descripcion del producto: ${product.description}</p>
                <hr>
            `
            productList.appendChild(card)
        })
    }
})
