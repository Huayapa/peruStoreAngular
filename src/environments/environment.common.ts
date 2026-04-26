export interface IEnvironment {
  titleApp: string;
  production: boolean;
  apiUrl: string;
}

export const commonEnvironment = {
  titleApp: 'Peru Store',
  production: false,
  apiUrl: 'https://fakestoreapi.com/',
};
