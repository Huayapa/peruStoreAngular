export interface IEnvironment {
  titleApp: string;
  production: boolean;
  apiUrl: string;
  stripePublicKey: string;
}

export const commonEnvironment = {
  titleApp: 'Peru Store',
  production: false,
  apiUrl: 'https://fakestoreapi.com/',
  stripePublicKey:
    'pk_test_51Pf15WGsCXoDv3xKxVPbrFCzrZ9Zvq3aG7yEgBHC4KWZ8JjSdotFgMgQ0bR34DBTQFus9RuX0ynaQYcBoFY5rHsj00vC9QswSV',
};
