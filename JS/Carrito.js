class Carrito {
    constructor(productos = []) {
        //Aqui guardo la lista de productos que viene de la API
        this.productos = productos;
        this.cantidades = {};

        //empiezo todos los productos a 0 unidades
        this.productos.forEach(producto => this.cantidades[producto.SKU] = 0);
        }

    actualizarUnidades(sku, unidades) {
        if (this.cantidades[sku] === undefined) {
            return;
        }
        //no dejo que baje de 0
        this.cantidades[sku] = Math.max(0, unidades);
    }

    obtenerInformacionProducto(sku) {
        const item = this.productos.find((p) => p.SKU === sku);
        if (!item) return null;

        return {
            sku: item.SKU,
            title: item.title,
            price: item.price,
            quantity: this.cantidades[sku] || 0
        };
    }

    obtenerCarrito() {
        let totalAcumulado = 0;
        const listaArticulos = [];

        this.productos.forEach((item) => {
            const cantidad = this.cantidades[item.SKU] || 0;

            if (cantidad > 0) {
                //convierto el precio a float
                const subtotal = cantidad * parseFloat(item.price);
                totalAcumulado += subtotal;

            listaArticulos.push({
                sku: item.SKU,
                title: item.title,
                price: item.price,
                quantity: cantidad,
                subtotal: subtotal.toFixed(2)
            });
            }
        });

        return {
            total: totalAcumulado.toFixed(2),
            currency: "€",
            products: listaArticulos 
        };
    }
}
