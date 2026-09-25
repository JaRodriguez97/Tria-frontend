import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-hero.component.html',
})
export class LandingHeroComponent {
  readonly universes = [
    { step: '01 / Belleza', label: 'Cuidado Botánico' },
    { step: '02 / Moda', label: 'Moda Femenina' },
    { step: '03 / Lencería', label: 'Lencería Fina' }
  ];
}
