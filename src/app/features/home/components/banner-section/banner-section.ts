import { Component, input } from '@angular/core';
import { Breadcrumb } from '../../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-banner-section',
  imports: [Breadcrumb],
  templateUrl: './banner-section.html',
  styleUrl: './banner-section.scss',
})
export class BannerSection {
  title = input.required();
}
