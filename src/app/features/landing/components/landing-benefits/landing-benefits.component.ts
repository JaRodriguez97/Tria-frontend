import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BenefitItem {
  step: string;
  icon: string;
  title: string;
  description: string;
  footer: string;
}

@Component({
  selector: 'app-landing-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-benefits.component.html',
})
export class LandingBenefitsComponent {
  readonly benefits: BenefitItem[] = [
    {
      step: '01 / CALIDAD',
      icon: 'select_all',
      title: 'Curaduría con Criterio',
      description:
        'Selección minuciosa pieza por pieza en series reducidas. Garantizamos exclusividad y autenticidad en cada detalle.',
      footer: 'Sin producciones masivas',
    },
    {
      step: '02 / CERCANÍA',
      icon: 'contact_support',
      title: 'Asesoría Personalizada',
      description:
        'Acompañamiento directo para tallajes exactos, sugerencias de estilo y combinaciones a la medida de tu figura.',
      footer: 'Fitting & Styling privado',
    },
    {
      step: '03 / FLUIDEZ',
      icon: 'drive_file_rename_outline',
      title: 'Experiencia Sin Fricción',
      description:
        'Gestión rápida por canales directos. Respuestas inmediatas y reserva de prendas en minutos vía WhatsApp e Instagram.',
      footer: 'Atención VIP 1-a-1',
    },
    {
      step: '04 / RITUAL',
      icon: 'inventory_2',
      title: 'Presentación Impecable',
      description:
        'Packaging satinado con aroma de autor característico de TRÍA, diseñado como un regalo que celebra tu buen gusto.',
      footer: 'Unboxing sensorial',
    },
  ];
}
