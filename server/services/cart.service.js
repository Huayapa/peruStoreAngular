class CartService {
  #MAX_QUANTITY = 100;

  #apiurl() {
    const url = process.env.API_URL_CART;
    if (!url) throw new Error('API_URL_CART no definida en variables de entorno');
    return url;
  }

  async getCartWithUpdatedPrices(prods) {
    const products = await Promise.all(
      prods.map(async (prod) => {
        this.#validateProd(prod)
        const data = await this.#getProductById(prod.productId);
        return { product: data, quantity: prod.quantity };
      }),
    );
    const total = this.#getTotalPrice(products);
    if(isNaN(total) || total < 0) {
      throw new Error('Error interno calculando el total del carrito.')
    }
    return { 
      amount: Math.round(total * 100), 
      products 
    };
  }

  #validateProd(prod) {
    if (!Number.isInteger(prod.quantity) || prod.quantity <= 0) {
      throw new Error('Cantidad inválida');
    }
    if (prod.quantity > this.#MAX_QUANTITY) {
      throw new Error('Cantidad excede el límite permitido');
    }
  }

  async #getProductById(id) {
    const response = await fetch(`${this.#apiurl()}/products/${id}`);
    if(!response.ok) throw new Error(`Producto ${id} no encontrado: ${response.status}.`)
    return response.json();
  }

  #getTotalPrice(prods) {
    return prods.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0);
  }
}

export default new CartService();