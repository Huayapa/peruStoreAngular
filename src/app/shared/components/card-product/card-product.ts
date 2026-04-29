import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatCardActions, MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { IProduct } from '../../interfaces/product.interface';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-card-product',
  imports: [MatIcon, MatCardActions, MatCard, MatCardHeader, MatCardTitle, MatFabButton],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
})
export class CardProduct {
  readonly product = input.required<IProduct>();
}
