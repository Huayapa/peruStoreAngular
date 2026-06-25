import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { HANDLE_CACHE_INTERCEPTOR } from '../../interceptors/cache-interceptor/cache-interceptor';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor';
import { ProductService } from './product';
import { SKIP_AUTH } from '../../interceptors/auth-interceptor/auth-interceptor';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpMock.verify());

  it('should have SKIP_AUTH, SKIP_SESSION and HANDLE_CACHE_INTERCEPTOR context enabled', () => {
    service.getProducts().subscribe();
    service.getProductId(2).subscribe();
    service.getFilteredProducts({}).subscribe();
    service.getCategory().subscribe();
    const reqs = httpMock.match(() => true);

    reqs.forEach((req) => {
      expect(req.request.context.get(SKIP_AUTH)).toBe(true);
      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
      expect(req.request.context.get(HANDLE_CACHE_INTERCEPTOR)).toBe(true);
      req.flush(null);
    });
  });
  describe('getProducts', () => {
    it('should return products', async () => {
      const mockProduct: IProduct[] = [
        {
          id: 2,
          title: 'Nombre Producto',
          category: 'Categoria',
          description: 'Descripcion de producto',
          image: 'https://domain.com/nombreImagen',
          price: 45,
        },
      ];

      const promise = firstValueFrom(service.getProducts());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(await promise).toEqual(mockProduct);
    });
    it('should use the method GET', () => {
      service.getProducts().subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null);

      expect(req.request.method).toBe('GET');
    });
    it('should propagate the error', async () => {
      const error = { status: 500, statusText: 'Server Error' };

      const promise = firstValueFrom(service.getProducts());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null, error);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
  describe('getProductId', () => {
    it('should return product', async () => {
      const mockProduct: IProduct = {
        id: 2,
        title: 'Nombre Producto',
        category: 'Categoria',
        description: 'Descripcion de producto',
        image: 'https://domain.com/nombreImagen',
        price: 45,
      };

      const promise = firstValueFrom(service.getProductId(mockProduct.id));
      const req = httpMock.expectOne({
        url: `${service['urlDomain']}products/${mockProduct.id}`,
        method: 'GET',
      });
      req.flush(mockProduct);

      expect(await promise).toEqual(mockProduct);
    });
    it('should use the method GET', () => {
      service.getProductId(2).subscribe();
      const req = httpMock.expectOne({
        url: `${service['urlDomain']}products/${2}`,
        method: 'GET',
      });
      req.flush(null);

      expect(req.request.method).toBe('GET');
    });
    it('should propagate the error', async () => {
      const error = { status: 500, statusText: 'Server Error' };

      const promise = firstValueFrom(service.getProductId(2));
      const req = httpMock.expectOne({
        url: `${service['urlDomain']}products/${2}`,
        method: 'GET',
      });
      req.flush(null, error);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
  describe('getFilteredProducts', () => {
    const mockProduct: IProduct[] = [
      {
        id: 1,
        title: 'Nombre',
        category: 'Cat 1',
        description: 'Descripcion',
        image: 'url',
        price: 20,
      },
      {
        id: 2,
        title: 'Nombre',
        category: 'Cat 2',
        description: 'Descripcion',
        image: 'url',
        price: 10,
      },
      {
        id: 3,
        title: 'Nombre',
        category: 'Cat 1',
        description: 'Descripcion',
        image: 'url',
        price: 50,
      },
      {
        id: 4,
        title: 'Otro',
        category: 'Cat 3',
        description: 'Descripcion',
        image: 'url',
        price: 5,
      },
    ];
    it('should return the filtered products', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({}));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(4);
    });
    it('should filter by category', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ categories: ['Cat 1'] }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(2);
      expect(result.products[0].category).toBe('Cat 1');
      expect(result.products[1].category).toBe('Cat 1');
    });
    it('should filter by text search', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ search: 'nom' }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(3);
      result.products.forEach((prod) => {
        expect(prod.title.toLowerCase()).toContain('nom');
      });
    });
    it('should filter by min and max price', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ min: 15, max: 50 }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      result.products.forEach((prod) => {
        expect(prod.price).toBeGreaterThanOrEqual(15);
        expect(prod.price).toBeLessThanOrEqual(50);
      });
    });
    it('should paginate the results correctly', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ page: 2, pageSize: 2 }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(2);
      expect(result.products[0].id).toBe(3);
      expect(result.products[1].id).toBe(4);
    });
    it('should return the total of filtered products', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({}));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.total).toBe(4);
    });
    it('should use the method GET', () => {
      service.getFilteredProducts({}).subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(req.request.method).toBe('GET');
    });
    it('should propagate the error', async () => {
      const error = { status: 500, statusText: 'Server Error' };
      const promise = firstValueFrom(service.getFilteredProducts({}));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null, error);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
  describe('getCategory', () => {
    const mockProduct: IProduct[] = [
      {
        id: 1,
        title: 'Nombre',
        category: 'Cat 1',
        description: 'Descripcion',
        image: 'url',
        price: 20,
      },
      {
        id: 2,
        title: 'Nombre',
        category: 'Cat 2',
        description: 'Descripcion',
        image: 'url',
        price: 10,
      },
      {
        id: 3,
        title: 'Nombre',
        category: 'Cat 1',
        description: 'Descripcion',
        image: 'url',
        price: 50,
      },
      {
        id: 4,
        title: 'Otro',
        category: 'Cat 3',
        description: 'Descripcion',
        image: 'url',
        price: 5,
      },
    ];
    const mockCategories = ['Cat 1', 'Cat 2', 'Cat 3'];
    it('should return the category list', async () => {
      const promise = firstValueFrom(service.getCategory());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(await promise).toEqual(mockCategories);
    });
    it('should use the method GET', () => {
      service.getCategory().subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(req.request.method).toBe('GET');
    });
    it('should propagate the error', async () => {
      const promise = firstValueFrom(service.getCategory());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
});
