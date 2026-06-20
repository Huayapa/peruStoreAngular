import { TestBed } from '@angular/core/testing';
import { ProductService } from './product';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { SKIP_AUTH } from '../../interceptors/auth-interceptor';
import { HANDLE_CACHE_INTERCEPTOR } from '../../interceptors/cache-interceptor';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor';
import { firstValueFrom } from 'rxjs';

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

  it('deberia tener el contexto del SKIP_AUTH, SKIP_SESSION y HANDLE_CACHE_INTERCEPTOR activado', () => {
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
    it('deberia retornar los productos', async () => {
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
    it('deberia usar el metodo GET', () => {
      service.getProducts().subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null);

      expect(req.request.method).toBe('GET');
    });
    it('deberia propagar el error', async () => {
      const error = { status: 500, statusText: 'Server Error' };

      const promise = firstValueFrom(service.getProducts());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null, error);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
  describe('getProductId', () => {
    it('deberia retornar el producto', async () => {
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
    it('deberia usar el metodo GET', () => {
      service.getProductId(2).subscribe();
      const req = httpMock.expectOne({
        url: `${service['urlDomain']}products/${2}`,
        method: 'GET',
      });
      req.flush(null);

      expect(req.request.method).toBe('GET');
    });
    it('deberia propagar el error', async () => {
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
    it('deberia traer los productos filtrados', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({}));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(4);
    });
    it('deberia filtrar por categoria', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ categories: ['Cat 1'] }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(2);
      expect(result.products[0].category).toBe('Cat 1');
      expect(result.products[1].category).toBe('Cat 1');
    });
    it('deberia filtrar por busqueda de texto', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ search: 'nom' }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(3);
      result.products.forEach((prod) => {
        expect(prod.title.toLowerCase()).toContain('nom');
      });
    });
    it('deberia filtrar por precio minimo y maximo', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ min: 15, max: 50 }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      result.products.forEach((prod) => {
        expect(prod.price).toBeGreaterThanOrEqual(15);
        expect(prod.price).toBeLessThanOrEqual(50);
      });
    });
    it('deberia paginar los resultados correctamente', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({ page: 2, pageSize: 2 }));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.products.length).toBe(2);
      expect(result.products[0].id).toBe(3);
      expect(result.products[1].id).toBe(4);
    });
    it('deberia retornar el total de productos filtrados', async () => {
      const promise = firstValueFrom(service.getFilteredProducts({}));
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      const result = await promise;
      expect(result.total).toBe(4);
    });
    it('deberia usar el metodo GET', () => {
      service.getFilteredProducts({}).subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(req.request.method).toBe('GET');
    });
    it('deberia propagar el error', async () => {
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
    it('deberia retornar la lista de categorias', async () => {
      const promise = firstValueFrom(service.getCategory());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(await promise).toEqual(mockCategories);
    });
    it('deberia usar el metodo GET', () => {
      service.getCategory().subscribe();
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(mockProduct);

      expect(req.request.method).toBe('GET');
    });
    it('deberia propagar el error', async () => {
      const promise = firstValueFrom(service.getCategory());
      const req = httpMock.expectOne({ url: `${service['urlDomain']}products`, method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Server Error' });

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
});
