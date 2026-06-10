import cartService from '../services/cart.service.js';
import checkoutSessionService from '../services/checkoutSession.service.js';
import orderService from '../services/order.service.js';
import stripeService from '../services/stripe.service.js';

export async function createPaymentIntent(req, res) {
  try {
    const { cart } = req.body;
    if (!cart?.products || !Array.isArray(cart.products)) {
      return res.status(400).json({ message: 'Carrito inválido' });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ message: 'Carrito vacio' });
    }

    const { amount, products } = await cartService.getCartWithUpdatedPrices(cart.products);

    if (amount < 50) {
      return res.status(400).json({ message: 'Monto mínimo es $0.50 USD' });
    }

    const token = req.headers['x-session-token'];
    const session = token ? checkoutSessionService.getSession(token) : null;
    const paymentIntentId = session?.paymentIntentId ?? null;

    if(session && session.status !== 'pending') {
      return res.status(400).json({ message: 'Sesión inválida o pago ya procesado.' });
    }

    const intent = await stripeService.createOrUpdatePaymentIntent(amount, paymentIntentId);

    await orderService.createOrder({ paymentIntentId: intent.id, products: cart.products, amount });

    const sessionToken = session ? token : checkoutSessionService.createSession(intent.id);

    return res.status(201).json({
      clientSecret: intent.client_secret,
      sessionToken,
      products,
      price: amount,
    });
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({ message: err.statusCode ? err.message : 'Error interno del servidor.' });
  }
}

export async function updatePaymentIntent(req, res) {
  try {
    const { orderData } = req.body;
    if (!orderData) {
      return res.status(400).json({ message: 'Se requieren orderdata' });
    }
    const validationError = validateOrderData(orderData);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const token = req.headers['x-session-token'];
    const { paymentIntentId } = checkoutSessionService.getSession(token);

    const existingOrder = orderService.getOrderById(paymentIntentId);
    if (!existingOrder) {
      return res.status(400).json({ message: 'No se encontró una orden asociada a este pago' });
    }

    await stripeService.updatePaymentIntentWithOrder(paymentIntentId, orderData, token);
    
    orderService.addExtraInformationOrder({
      extraInformation: orderData,
      id: paymentIntentId,
    });

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: 'Error al procesar la información de la orden' });
  }
}

export async function cancelPaymentIntent(req, res) {
  try {
    const token = req.headers['x-session-token'];
    const { paymentIntentId } = checkoutSessionService.getSession(token);

    const order = orderService.getOrderById(paymentIntentId);
    if (!order) {
      return res.status(400).json({ message: 'No se cancelo la orden' });
    }
    if (!['draft', 'pending'].includes(order.status)) {
      return res.status(400).json({ message: 'Tu compra ya fue procesada. Para realizar una nueva compra, inicia el proceso nuevamente.' });
    }

    await stripeService.cancelPaymentIntent(paymentIntentId);
    orderService.removeOrder(paymentIntentId);
    checkoutSessionService.removeSession(token);

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: 'Error al cancelar el intento de pago' });
  }
}

function validateOrderData(orderData) {
  const { name, email, phone, city, state, zipcode, address } = orderData;

  const textField = (value, min = 3, max = 100) =>
    !value || value.trim().length < min || value.trim().length > max;

  const validateField = (isvalid, message) => (isvalid ? message : null);

  return (
    validateField(
      textField(name, 3, 100),
      'El nombre es requerido y debe ser mayor a 3 y menor a 100 caracteres.',
    ) ??
    validateField(
      textField(city, 3, 100),
      'La ciudad es requerida y debe ser mayor a 3 y menor a 100 caracteres.',
    ) ??
    validateField(
      textField(state, 3, 50),
      'El estado es requerido y debe ser mayor a 3 y menor a 50 caracteres.',
    ) ??
    validateField(
      textField(address, 5, 120),
      'La dirección es requerida y debe ser mayor a 5 y menor a 120 caracteres.',
    ) ??
    validateField(
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      'Email es requerido y debe ser formato valido',
    ) ??
    validateField(
      !phone || !/^\+?[\d\s\-().]{7,15}$/.test(phone),
      'Phone es requerido y debe ser formato valido',
    ) ??
    validateField(
      !zipcode || !/^\d{5}$/.test(zipcode),
      'Zipcode es requerido y debe tener 5 digitos',
    )
  );
}
