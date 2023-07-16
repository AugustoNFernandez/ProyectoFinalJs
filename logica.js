//let para poder modificarlo con async/await de asincronia JSON
let productos; 
// Llamar productos del JSON
obtenerJsonProds();
// recupera el carrito de del storage  (operador avanzado OR)
let carro = JSON.parse(localStorage.getItem('carro')) || []; 
//variables del documento para interaccionar con HTML / DOM
let tablaBody = document.getElementById('tablabody');
let contenedorProds = document.getElementById('misprods');
//tratamiento si encontramos algo en un carrito abandonado
(carro.length != 0) && traerCarritoAvandonado();
// var global para sumar total de compras 
let total = 0;

//recupera y muestra la tabla de carrito si hay algo en el storage "avandonado"
function traerCarritoAvandonado(){
    for(const producto of carro){
        document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><button class="btn btn-light" id="eliminar" onclick="eliminar(event)">X</button></td>
        </tr>
    `;
    }
    totalCarrito = carro.reduce((acumulador,producto)=> acumulador + producto.precio,0);

    let infoTotal = document.getElementById("total");
    infoTotal.innerText="Total a pagar $: "+totalCarrito;
}

//Controlar datos ingresados en los inputs. Chequeo de longitud minima. Uso de ternario
let nombre = document.getElementById('nombre');
nombre.onkeyup = () => {
    nombre.style.backgroundColor = nombre.value.length < 3 ? "#E97E9E" : "white";
};


//Controlar datos ingresados en los inputs. Chequeo que incluya caracteres especificos.
let email = document.getElementById('email');
email.addEventListener('input',()=>{ 
    if(!email.value.includes('@') || !email.value.includes('.')){
        document.getElementById('mensaje').innerText='Agregar @ y .' 
    }else{
        document.getElementById('mensaje').innerText='';
    } 
})

//Funcion para boton para borrar campos
const botonBorrar = document.getElementById('borrarCampos');

function borrarC() {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    nombre.value = '';
    email.value = '';
}

botonBorrar.addEventListener('click', borrarC);

let formulario = document.getElementById('formulario');
formulario.addEventListener('submit', validar);

//Validar si lo ingresado en los campos es correcto 
function validar(evento) {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');

    if (nombre.value === '' || email.value === '') {
        evento.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'Ingrese nombre y email válido',
            timer: 3500
        });
    } else if (!email.value.includes('@') || !email.value.includes('.')) {
        evento.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Atención',
            text: 'Ingrese un email válido',
            timer: 3500
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Datos verificados',
            showConfirmButton: false,
            timer: 3500
        });
    }
}

//mostrar carrito en modal
const verCarrito = document.getElementById('verCarrito');
verCarrito.addEventListener('click',()=>{
    const modal = document.getElementById('carritoModal');
    modal.style.display = 'block';
})

// Oculta el modal con el boton "Cerrar"
cerrarModalBtn.addEventListener('click',()=>{
    const modal = document.getElementById('carritoModal');
    modal.style.display = 'none';
})
//cerrar modal al hacer click en otra parate que no sea sobre el modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('carritoModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

//Agragar Productos al HTML mediante DOM
function renderizarProductos(listaProds){
    // se vacia contenedor
    contenedorProds.innerHTML=''; 
    //se carga las cards
    for(const prod of listaProds){ 
        contenedorProds.innerHTML+=`
            <div id="carta" class="card card col-sm-12 col-md-5 col-lg-3"> 
                <img class="card-img-top" src=${prod.foto} alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${prod.nombre}</h5>
                    <p class="card-text">$ ${prod.precio}</p>
                    <button id=${prod.id} class="btn btn-primary compra">Comprar</button>
                </div>
            </div>
        `;
    }

    //eventos
    let botones = document.getElementsByClassName('compra');
    for(const boton of botones){
        boton.addEventListener('click',()=>{
           const prodACarro = productos.find((producto) => producto.id == boton.id);
           //cargar prods al carro
           agregarACarrito(prodACarro);  
        })

        //Cambiar de color el boton al pasar sore él con el cursor
        boton.onmouseover = () => {
            boton.classList.replace('btn-primary','btn-info');
        }
        boton.onmouseout = () => {
            boton.classList.replace('btn-info','btn-primary');
        }
    }
}



//Funcion para agregar a carro
function agregarACarrito(producto){
    //se pushea/sube al carro
    carro.push(producto);   
    //Utilizacion de SweetAlert para reemplazar alerts
    Swal.fire({             
        title: 'Excelente elección!',
        text: `Agregaste ${producto.nombre} al carrito!`,
        timer: 1500,
        imageUrl: producto.foto,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: producto.nombre,
      });
    tablaBody.innerHTML += `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><button class="btn btn-light" id="eliminar" onclick="eliminar(event)">X</button></td>
        </tr>
    `;
    //variable para clacular el total sumado
    total = carro.reduce((ac,prod)=> ac + prod.precio,0);
    document.getElementById('total').innerText = `Total a pagar $:${total}`;
    //subir lo cargado a carro al storage
    localStorage.setItem('carro',JSON.stringify(carro));
}

//Funcion para sacar productos del carro 
function eliminar(event){
    console.log(event);
    let fila = event.target.parentElement.parentElement;
    let id = fila.children[0].innerText;
    let indice = carro.findIndex(producto => producto.id == id);
    //remueve el producto del carro
    carro.splice(indice,1);
    console.table(carro);
    //remueve la fila de la tabla
    fila.remove();
    //recalcular el total sin lo eliminado
    let preciosAcumulados = carro.reduce((acumulador,producto)=>acumulador+producto.precio,0);
    total.innerText='Total a pagar $: '+preciosAcumulados;
    //Actualizacion del storage
    localStorage.setItem('carro',JSON.stringify(carro));
}

function enviarDatos(){
    const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
    fetch(URLPOST,{
        method: 'POST',
        body: JSON.stringify(carro),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .catch((error) => {
        console.log(error)
        })
    .then((data) => console.log(data))
    .finally(() => {
        console.log('Fin de la simulacion')
        })
}

//Boton para finalizar operacion
let finalizarCompraBoton = document.getElementById("botonFinalizar");

function sumarIva(total) {
    let totalConIva = total * 1.21;
    return totalConIva;
}
finalizarCompraBoton.onclick = () => {
// Antes de vaciar el carro, envío con POST el pedido a JsonPlaceholder para simular el fin del proceso
    enviarDatos();
    // Vaciar el carro
    carro = [];
    document.getElementById('tablabody').innerHTML = '';
    document.getElementById('total').innerText = 'Total a pagar $: ' + 0;     
    // Calcular el total con IVA
    let totalConIva = sumarIva(total);
    console.log(totalConIva); //imprimo para confirmar funcionamiento
    // S.Alert de confirmación de compra
    Swal.fire('Gracias por tu compra', 'Su total es $ ' +totalConIva+' (precio mas iva)','success');
    // Remover el producto del local storage
    localStorage.removeItem('carro');
    // Reseteo de la variable total
    total = 0;
}

//vaciar carro
let vaciarCarroBoton = document.getElementById("botonVaciar");

vaciarCarroBoton.onclick=()=>{
    Swal.fire({
        title: 'Esta seguro?',
        text: "Esta por vaciar el contenido del carro!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vaciarlo',
      }).then((result) => {     
        // Si cancela el vaciado, no se borra el contenido de carro
        if (result.isConfirmed) { 
            document.getElementById('tablabody').innerHTML='';
            document.getElementById('total').innerText = 'Total a pagar $:';
            carro=[];
            localStorage.removeItem("carro");
            total=0;
            Swal.fire(
                'Vaciado!',
                'Carrito sin productos.',
                'success'            
            )
        }
      })

    //actualizacion del storage 
    localStorage.removeItem("carro");
}

//Obtener array de productos desde JSON  (async/await)
async function obtenerJsonProds(){
    const URLJSON = '/productos.json'; 
    //ruta relativa del archivo
    const respuesta = await fetch(URLJSON);
    const data = await respuesta.json();
    console.log(data); 
    // confirmo por consola que se carga el array 
    productos = data;
    renderizarProductos(productos);
}



//local Storage Carrito
const guardados = () => {
localStorage.setItem('carrito', JSON.stringify(carrito));
}


