import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContactDetail {
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-contact.component.html',
  styleUrl: './landing-contact.component.scss',
})
export class LandingContactComponent {
  readonly contactDetails: ContactDetail[] = [
    {
      title: 'Sede Central',
      description: 'Cali, Colombia',
    },
    {
      title: 'Envíos Boutique',
      description: 'Entregas nacionales coordinadas',
    },
    {
      title: 'Tiempo de Respuesta',
      description: 'Menos de 15 minutos en WhatsApp',
    },
  ];
}
