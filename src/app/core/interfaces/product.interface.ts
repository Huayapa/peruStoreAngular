import { IProduct } from '../../shared/interfaces/product.interface';

export interface IFilterProduct {
  categories?: string[];
  search?: string;
  min?: number;
  max?: number;
  page?: number;
  pageSize?: number;
}

export interface IFilteredResult {
  products: IProduct[];
  total: number;
}
