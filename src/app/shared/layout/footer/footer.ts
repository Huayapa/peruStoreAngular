import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconButton, MatIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
