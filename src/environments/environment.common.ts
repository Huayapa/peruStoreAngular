export interface IEnvironment {
  titleApp: string;
  production: boolean;
  apiUrl: string;
  stripePublicKey: string;
  stripeApiUrl: string;
}

export const commonEnvironment = {
  titleApp: 'Peru Store',
  production: false,
  apiUrl: 'https://fakestoreapi.com/',
  stripePublicKey:
    'pk_test_51Pf15WGsCXoDv3xKxVPbrFCzrZ9Zvq3aG7yEgBHC4KWZ8JjSdotFgMgQ0bR34DBTQFus9RuX0ynaQYcBoFY5rHsj00vC9QswSV',
  stripeApiUrl: 'http://localhost:3000/stripe',
};
