import { Component, input, output } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-shop-pagination',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './shop-pagination.html',
  styleUrl: './shop-pagination.scss',
})
export class ShopPagination {
  page = input.required<number>();
  totalPages = input.required<number[]>();

  pageChange = output<number>();
}
