import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IdentityPillar {
  step: string;
  title: string;
  description: string;
  footer: string;
  icon: string;
  footerIcon?: string;
  highlighted?: boolean;
}

@Component({
  selector: 'app-landing-identity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-identity.component.html',
})
export class LandingIdentityComponent {
  readonly pilares: IdentityPillar[] = [
    {
      step: 'Pilar 01',
      title: 'Feminidad & Silueta',
      description:
        'Líneas contemporáneas con caídas fluidas y patronajes que realzan tu presencia. Prendas versátiles que se transforman del día a la noche con naturalidad aristocrática.',
      footer: 'Moda Femenina',
      icon: 'styler',
      highlighted: false,
    },
    {
      step: 'Pilar 02',
      title: 'Dirección y Visión Tría',
      description:
        'Una curaduría exclusiva diseñada para resaltar tu seguridad y elegancia. Seleccionamos piezas que combinan alta confección, diseño contemporáneo y confort absoluto para acompañar cada momento de tu vida.',
      footer: 'Curaduría Exclusiva · Diseño Contemporáneo',
      icon: 'favorite',
      footerIcon: 'auto_awesome',
      highlighted: true,
    },
    {
      step: 'Pilar 03',
      title: 'Sensualidad & Cuidado',
      description:
        'Encajes de seda íntimos y alquimia cosmética curada para complacer tus sentidos más privados. El arte de vestirte y cuidarte para ti misma antes que para nadie más.',
      footer: 'Lencería & Cosmética',
      icon: 'spa',
      highlighted: false,
    },
  ];
}
