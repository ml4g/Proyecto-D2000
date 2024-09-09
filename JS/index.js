import {Producto} from './entities/Producto.js';
import {ElementoCarrito} from 'ElementoCarrito.js';

/**
 * Definiciones de constantes
 */
const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

/**
 * Vamos a crear listas de apoyo
 * para Producto y Elemento de Carrito
 */

//Comentaario de linea
/*
Comentario bloque
bloque2
bloque3
*/

//var --> Sobreescribr o crear un alamacen de memorio de variable (no lo recomiendo)
//const --> Crear constantes
//let --> Varioable regular de JavaScript

const productos = [];
const elementosCarrito = [];

/**
 * Referencias a elementos en DOM
 */
const contenedorProductos = document.getElementById('contenedor-productos');
//contenedorProductos.innerHTML = '<p>Prueba de sustitucion<p>'

/**
 * Arrow function para cargar prodcutos
 */

/**
 * EJEMPLO CON ERROR DE CARGA
 * const cargarProductos = () => {
    fetch('./js/data/productos.jso')
        .then(respuesta => respuesta.json())
        .then(productosJS => {
            productosJS.forEach(elementoJson => {
                productos.push(new Producto(
                    elementoJson.id,
                    elementoJson.nombre,
                    elementoJson.precio,
                    elementoJson.urlFoto,
                    elementoJson.descripcion
                ));
            });
            console.log('Productos completos', productos);
        })
        .then(() => {
            console.log("¡Todo se cargó con éxito!")
        })
        .catch(error => {
            console.error("Hubo un error al cargar la información", error);
            Swal.fire({
                title: 'Imposible realizar la carga',
                text: `Éste es el error recibido: ${error}`,
                icon: 'error'
            });
        });
      
};
*/

const cargarProductos = () => {
    fetch('./js/data/productos.json')
        .then(respuesta => respuesta.json())
        .then(productosJS => {
            productosJS.forEach(elementoJson => {
                productos.push(new Producto(
                    elementoJson.id,
                    elementoJson.nombre,
                    elementoJson.precio,
                    elementoJson.urlFoto,
                    elementoJson.descripcion
                ));
            });
            cargarCarritoLocalStorage();
            dibujarCatalogoProductos();
            dibujarCarritoCompras();
            console.log('Productos completos', productos);
        })
        .then(() => {
            console.log("¡Todo se cargó con éxito!")
        })
        .catch(error => {
            console.error("Hubo un error al cargar la información", error);
            Swal.fire({
                title: 'Imposible realizar la carga',
                text: `Éste es el error recibido: ${error}`,
                icon: 'error'
            });
        })
        .finally(( () => console.info("Fetch terminado")));
};

const crearCardProducto = (producto) => {
    //Boton de compra
    let botonAgregar = document.createElement('button');
    botonAgregar.classList.add('btn');
    botonAgregar.classList.add('btn-success')
    botonAgregar.innerText = "Comprar"
    
    botonAgregar.onclick = crearEventoAgregarProducto(producto);

    

    //Pie de carta
    let pieCarta = document.createElement('div');
    pieCarta.className = 'card-footer text-end';
    pieCarta.appendChild(botonAgregar);

    //Carta
    let carta = document.createElement('div');
    carta.className = 'card h-100';
    

    //imagen
    let imagenProducto = document.createElement('img');
    imagenProducto.src = producto.urlFoto;
    imagenProducto.className = 'card-img-top';
    imagenProducto.alt = producto.nombre;

    //Cuerpo carta
    let cuerpoCarta = document.createElement('div');
    cuerpoCarta.className = 'card-body';
    cuerpoCarta.innerHTML = `
        <h5class="card-title">${producto.nombre}</h5>
        <h6class="card-subtittle mb-2 text-body-secondary">$ ${producto.precio} MXN</h6>
        <p class="card-text">${producto.descripcion}</p>
    `;

    //Elementos de carta
    carta.appendChild(imagenProducto);
    carta.appendChild(cuerpoCarta);
    carta.appendChild(pieCarta);

    //Celda
    let celda = document.createElement('div');
    celda.className = 'col';
    celda.appendChild(carta);



    //Esto es temporal... solo para ir probando
    return celda;
};

const crearEventoAgregarProducto = producto => {
    return ev => {
        //console.log("Info de evento:", ev);

        let elementoCarritoEncontrado = elementosCarrito.find(
            elemento => {
                return elemento.producto.id == producto.id;
            }
        );
        //Aquí estamos preguntando si elementoCarritoEncontrado trae información
        if(elementoCarritoEncontrado) {
            elementoCarritoEncontrado.cantidad++;
        } else {
            let elemento = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elemento);
        }
        
        let carritoComprasJson = JSON.stringify(elementosCarrito);
        console.info("Carrito de compras a guardar:", carritoComprasJson);
        localStorage.setItem('carritoComprasJson', carritoComprasJson);

        dibujarCarritoCompras();

        Swal.fire({
            title: 'Producto agregado!',
            text: `${producto.nombre} agregado con exito.`,
            icon: 'success',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cerrar',
            confirmButtonText: 'Ir a carrito',
            confirmButtonColor: '#3085d6'                     
        }).then(
            resultado => {
                if(resultado.isConfirmed) {
                    const carritoCompras = document.getElementById('carritoCompras');
                    const modalCarrito = new bootstrap.Modal(carritoCompras, {
                        keyboard: true
                    });

                    const botonAbrirCarrito = document.getElementById('botonAbrirCarrito');

                    modalCarrito.show(botonAbrirCarrito)
                }
            }
        );

        //console.log("Elementos en carrito:", elementosCarrito);
    }
};
      
const cargarCarritoLocalStorage = () => {
    let carritoComprasTexto = localStorage.getItem("carritoComprasJson");
    console.info('Carrito de compras en local storage:', carritoComprasTexto);
    if(carritoComprasTexto) {
        let carritoComprasJson = JSON.parse(carritoComprasTexto);
        carritoComprasJson.forEach(
            elementoJson => {
                let producto = new Producto(
                    elementoJson.producto.id,
                    elementoJson.producto.nombre,
                    elementoJson.producto.precio,
                    elementoJson.producto.urlFoto,
                    elementoJson.producto.descripcion
                );
                let elementoCarrito = new ElementoCarrito(producto, elementoJson.cantidad);
                elementosCarrito.push(elementoCarrito);
            }
        );
    }
};

const dibujarCarritoCompras = () => {
    const bodyCarrito = document.getElementById('bodyCarrito');
    bodyCarrito.innerHTML = '';

    let sumaCarrito = 0;

    elementosCarrito.forEach(
        (elemento, i) => {
            let renglon = document.createElement('tr');
            renglon.innerHTML = `
                <th scope="row">${elemento.producto.id}</th>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${i}" type="number" 
                        value="${elemento.cantidad}" 
                        min="1" max="100" step="1"
                        class= "caja-cantidad-producto"></td>
                <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio)}</td>
                <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio*elemento.cantidad)}</td>
            `;

            bodyCarrito.appendChild(renglon);

            let inputCantidadProducto = document.getElementById('cantidad-producto-'+i)
            //let inputCantidadProducto = document.getElementById(`cantidad-producto-${i}`)
            inputCantidadProducto.onchange = ev => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;
                dibujarCarritoCompras();
            };

            sumaCarrito+=elemento.producto.precio*elemento.cantidad;

        }
    );

    const footerCarrito = document.getElementById('footerCarrito');

    if(elementosCarrito.length == 0) {
        footerCarrito.innerHTML = '<span>No hay productos en el carrito :(</span>';
    } else {
        footerCarrito.innerHTML = `Total de la compra: $ ${estandarDolaresAmericanos.format(sumaCarrito)}`;
    }
};

const dibujarCatalogoProductos = () => {
    let contenedorProductos = document.getElementById('contenedor-productos');
    contenedorProductos.innerHTML = '';
    productos.forEach(
        productoActual => {
            contenedorProductos.appendChild(crearCardProducto(productoActual));
        }
    );

};

const finalizarCompra = () => {
    //Borrar carrito en memoria RAM
    elementosCarrito.splice(0, elementosCarrito.length);

    //Borrar carrito en local storage
    localStorage.removeItem('carritoComprasJson');
    
    //Dibujar carrito de compras vacio
    dibujarCarritoCompras();

    Swal.fire( 
        {
            title: 'Compra Exitosa!',
            text:'Pedido concluido',
            icon: 'success'

        }

    );
};
let botonFinalizarCompra = document.getElementById('boton-finalizar-compra');
botonFinalizarCompra.onclick = finalizarCompra;

//Funcion Pruebas de vista
const probarVista = () => {
    let productoPrueba = 
        new Producto(99, 'Prueba!', 950.00, "./img/discoH.jpg", 'En proceso...'); 
    let cartaPrueba = crearCardProducto(productoPrueba);
    const contenedorPruebas = 
        document.getElementById('contenedor-pruebas');
    
    contenedorPruebas.appendChild(document.createElement('br'))
    contenedorPruebas.appendChild(cartaPrueba);
};

//Ejecución de funciones de prueba
//probarVista();

/**
 * ejecucion de funciones para carga
 */

cargarProductos();
//dibujarCatalogoProductos()