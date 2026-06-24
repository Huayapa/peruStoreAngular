import { APP_ROUTES } from './app-routes';

describe('APP_ROUTES', () => {
  describe('PRODUCTS.DETAIL.DETAIL_LINK', () => {
    it('should generate the correct product url', () => {
      expect(APP_ROUTES.PRODUCTS.DETAIL.DETAIL_LINK(5)).toBe('/products/5');
    });
  });
});
