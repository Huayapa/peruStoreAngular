import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-slider-products',
  imports: [MatIcon, MatIconButton],
  templateUrl: './slider-products.html',
  styleUrl: './slider-products.scss',
})
export class SliderProducts implements OnInit {
  title = input.required<string>();
  products = input.required<string[]>();
  // Slider cart
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setInterval> | null = null;
  currentIndex = signal(0);
  itemsPerView = 4;

  get translateX(): string {
    return `translateX(-${this.currentIndex() * (100 / this.itemsPerView)}%)`;
  }

  ngOnInit(): void {
    this.startTimer();
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  prev(): void {
    this.currentIndex.update((num) => (num > 0 ? num - 1 : num));
  }

  next(): void {
    this.currentIndex.update((num) =>
      num + this.itemsPerView < this.products().length ? num + 1 : 0,
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
