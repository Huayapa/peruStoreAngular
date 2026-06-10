class CheckoutSessionService {
  /** @type {Map<string, { paymentIntentId: string, expiresAt: number, status: 'pending' | 'paid' | 'cancelled' }>} */
  #sessions = new Map();

  #generateToken() {
    let token;
    do {
      token = crypto.randomUUID();
    } while (this.#sessions.has(token));
    return token;
  }

  getAllSessions() {
    return this.#sessions
  }

  /** @param {string} paymentIntentId  */
  createSession(paymentIntentId) {
    const token = this.#generateToken();
    this.#sessions.set(token, {
      paymentIntentId,
      expiresAt: Date.now() + 30 * 60 * 1000,
      status: 'pending'
    });
    return token;
  }

  /** @param {string} token  */
  getSession(token) {
    const session = this.#sessions.get(token);
    if (!session) return null;
    if(session.status !== 'pending') return null
    if (Date.now() > session.expiresAt) {
      session.status = 'cancelled'
      return null;
    }
    return session;
  }

  /** @param {string} token  */
  removeSession(token) {
    const session = this.#sessions.get(token);
    if(session !== 'pending') return
    session.status = 'cancelled'
  }

}

export default new CheckoutSessionService();
