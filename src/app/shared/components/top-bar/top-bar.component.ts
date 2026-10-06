import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  @Input() subtitle: string = '';
  @Input() showBackButton: boolean = false;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
