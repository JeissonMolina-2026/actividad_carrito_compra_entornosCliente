//URL de la API en jsonblob
const API_URL = "https://jsonblob.com/api/jsonBlob/01a17920-514e-781d-9b3f-06d256bc50fa";

// Variable global donde guardo la instancia del Carrito
let Carro = null;

// 2. Rf a los elementos del DOM
const tbodyProductos = document.getElementById("lista_productos");
const listaResumen = document.getElementById("lineas_pedido");
const txtTotalFinal = document.getElementById("precio_final");

async function cargarTienda() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error(`fallo en la llamada de la API`);
    }

    const datos = await respuesta.json();

    // Instancia de la clase Carrito 
    Carro = new Carrito(datos.products);

    pintarFilas(datos.products);
    actualizarVista();
  } catch (error) {
    console.error("No se pudo cargar la tienda:", error);
  }
}

function pintarFilas(catalogo) {
  tbodyProductos.innerHTML = "";

  catalogo.forEach(item => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>
        <strong>${item.title}</strong>
        <div class="ref_producto">REF: ${item.SKU}</div>
      </td>
      <td>
        <div class="selector_cantidad">
          <button class="btn_control btn-menos" data-sku="${item.SKU}">-</button>
          <span class="numero_unidades" id="cant-${item.SKU}">0</span>
          <button class="btn_control btn-mas" data-sku="${item.SKU}">+</button>
        </div>
      </td>
      <td>${item.price}€</td>
      <td id="subtotal-${item.SKU}">0.00€</td>
    `;

    tbodyProductos.appendChild(fila);
  });

  activarBotones();
}

function activarBotones() {
  document.querySelectorAll(".btn-menos").forEach((boton) => {
    boton.addEventListener("click", () => {
      const sku = boton.getAttribute("data-sku");
      const infoActual = Carro.obtenerInformacionProducto(sku);
      Carro.actualizarUnidades(sku, infoActual.quantity - 1);
      actualizarVista();
    });
  });

  document.querySelectorAll(".btn-mas").forEach((boton) => {
    boton.addEventListener("click", () => {
      const sku = boton.getAttribute("data-sku");
      const infoActual = Carro.obtenerInformacionProducto(sku);
      Carro.actualizarUnidades(sku, infoActual.quantity + 1);
      actualizarVista();
    });
  });
}

function actualizarVista() {
  const estado = Carro.obtenerCarrito();

  Carro.productos.forEach((item) => {
    const info = Carro.obtenerInformacionProducto(item.SKU);
    const elemCantidad = document.getElementById(`cant-${item.SKU}`);
    const elemSubtotal = document.getElementById(`subtotal-${item.SKU}`);

    if (elemCantidad && elemSubtotal) {
      elemCantidad.textContent = info.quantity;
      const subtotalFila = (info.quantity * parseFloat(item.price)).toFixed(2);
      elemSubtotal.textContent = `${subtotalFila}${estado.currency}`;
    }
  });

  listaResumen.innerHTML = "";

  estado.products.forEach(p => {
    const li = document.createElement("li");
    li.className = "item_pedido";
    li.innerHTML = `
      <span>${p.quantity} x ${p.title}</span>
      <span>${p.quantity} x ${p.price}${estado.currency}</span>
    `;
    listaResumen.appendChild(li);
  });

  txtTotalFinal.textContent = `${estado.total}${estado.currency}`;
}

document.addEventListener("DOMContentLoaded", cargarTienda);