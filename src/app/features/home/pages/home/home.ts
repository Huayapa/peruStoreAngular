import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../core/services/product/product';
import { SliderProducts } from '../../../../shared/components/slider-products/slider-products';
import { Categories } from '../../components/categories/categories';
import { Slider } from '../../components/slider/slider';
import { ISlide } from '../../interfaces/slider.interface';

@Component({
  selector: 'app-home',
  imports: [Slider, SliderProducts, Categories],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class HomePage {
  readonly slides: ISlide[] = [
    {
      image: '/image/banner2.png',
      title: 'Calidad que se siente',
      subtitle: 'Materiales premium seleccionados',
      descript: 'Cada producto diseñado para durar',
    },
    {
      image: '/image/banner2.png',
      title: 'Ofertas exclusivas',
      subtitle: 'Solo por tiempo limitado',
      descript: 'Descubre descuentos de hasta 40%',
    },
    {
      image: '/image/banner3.png',
      title: 'Nueva colección',
      subtitle: 'Tendencias de temporada',
      descript: 'Estilo moderno para cada ocasión',
    },
    { image: '/image/banner1.png' },
  ];
  private readonly _product = inject(ProductService);
  featuredProducts = toSignal(this._product.getFilteredProducts({ pageSize: 4, page: 2 }), {
    initialValue: { products: [], total: 0 },
  });
  newsProducts = toSignal(this._product.getFilteredProducts({ pageSize: 8 }), {
    initialValue: { products: [], total: 0 },
  });
}
