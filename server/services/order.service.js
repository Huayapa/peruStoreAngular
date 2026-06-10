/**
 * Este servicio esta creado solo para simular el manejo de orden
 * cuando stripe trabaja con el webhook
 */

class OrderService {
  /** @type {{
   * id: string,
   * products: { productId: string, quantity: number }[],
   * status: 'pending' | 'draft' | 'cancelled' | 'paid',
   * total: number,
   * extraInformation: { name: string, email: string, phone: string, city: string, zipcode: string, address: string, state: string }
   * }[]} */
  #orders = [];

  createOrder({ paymentIntentId, products, amount, status = 'draft' }) {
    if (!this.#isStatusValid(status)) throw new Error('El estado no es valido');

    const existing = this.#orders.find((order) => order.id === paymentIntentId);
    if (existing) {
      return this.updateOrder({ paymentIntentId, products, amount });
    }

    const order = { id: paymentIntentId, products, status, total: amount };
    this.#orders.push(order);
    return order;
  }

  updateOrder({ paymentIntentId, products, amount }) {
    const order = this.#orders.find((order) => order.id === paymentIntentId);
    if (!order) throw new Error('El orden no fue encontrado.');
    order.products = products;
    order.total = amount;
    return order;
  }

  getAllOrders() {
    return this.#orders;
  }

  getOrderById(id) {
    return this.#orders.find((order) => order.id === id) ?? null;
  }

  removeOrder(id) {
    this.#orders = this.#orders.filter((order) => order.id !== id);
  }

  addExtraInformationOrder({ extraInformation = {}, id }) {
    const { name, email, phone, city, state, zipcode, address } = extraInformation;
    const order = this.#orders.find((order) => order.id === id);
    if (!order) throw new Error('Orden no encontrado');
    order.extraInformation = { name, email, phone, city, state, zipcode, address };
    order.status = 'pending';
    return order;
  }

  changeStatus(id, newStatus) {
    if (!this.#isStatusValid(newStatus)) throw new Error('Estado Invalido');
    const order = this.#orders.find((order) => order.id === id);
    if (!order) throw new Error('Orden no encontrado');
    order.status = newStatus;
    return order;
  }

  #isStatusValid(status) {
    const statusAvaliable = ['pending', 'draft', 'cancelled', 'paid'];
    return statusAvaliable.includes(status);
  }
}

export default new OrderService();
