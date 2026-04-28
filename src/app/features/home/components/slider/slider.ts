import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ISlide } from '../../interfaces/slider.interface';

@Component({
  selector: 'app-slider',
  imports: [MatIcon, MatIconButton],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class Slider implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setInterval> | null = null;
  slides = input.required<ISlide[]>();
  currentIndex = signal(0);

  ngOnInit(): void {
    this.startTimer();
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  next() {
    this.currentIndex.update((num) => (num - 1 + this.slides().length) % this.slides().length);
  }
  prev() {
    this.currentIndex.update((num) => (num + 1) % this.slides().length);
  }

  private startTimer(): void {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.currentIndex.update((num) => (num + 1) % this.slides().length);
    }, 4000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
