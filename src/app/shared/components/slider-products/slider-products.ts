import { Component, OnInit, input, inject, DestroyRef, signal, HostListener } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IProduct } from '../../interfaces/product.interface';
import { CardProduct } from '../card-product/card-product';

@Component({
  selector: 'app-slider-products',
  imports: [MatIcon, MatIconButton, CardProduct],
  templateUrl: './slider-products.html',
  styleUrl: './slider-products.scss',
})
export class SliderProducts implements OnInit {
  title = input.required<string>();
  products = input.required<IProduct[]>();
  // Slider cart
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setInterval> | null = null;
  currentIndex = signal(0);
  itemsPerView = signal(4);

  get translateX(): string {
    return `translateX(-${this.currentIndex() * (100 / this.itemsPerView())}%)`;
  }

  ngOnInit(): void {
    this.adjustLayout(window.innerWidth);
    this.startTimer();
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustLayout(window.innerWidth);
  }

  private adjustLayout(width: number) {
    if (width < 600) this.itemsPerView.set(1);
    else if (width < 900) this.itemsPerView.set(2);
    else if (width < 1200) this.itemsPerView.set(3);
    else this.itemsPerView.set(4);
  }

  prev(): void {
    this.currentIndex.update((num) => (num > 0 ? num - 1 : num));
  }

  next(): void {
    this.currentIndex.update((num) =>
      num + this.itemsPerView() < this.products().length ? num + 1 : 0,
    );
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), 4000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
