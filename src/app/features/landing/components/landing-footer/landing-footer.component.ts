import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-footer.component.html',
})
export class LandingFooterComponent {
  cierreLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Manifiesto', href: '#identidad' },
    { label: 'Universos', href: '#colecciones' },
    { label: 'Selección', href: '#seleccion' },
    { label: 'Experiencia', href: '#beneficios' },
    { label: 'Contacto', href: '#contacto' }
  ];

  coleccionesLinks = [
    { label: 'Moda & Alta Sastrería', href: '#colecciones' },
    { label: 'Lencería Fina de Autor', href: '#colecciones' },
    { label: 'Rituales de Belleza', href: '#colecciones' },
    { label: 'Cuidado Facial Botánico', href: '#colecciones' },
    { label: 'Piezas de Edición Exclusiva', href: '#colecciones' }
  ];

  navegacionLinks = [
    { label: 'Sobre la Boutique', href: '#identidad' },
    { label: 'Guía de Tallas Personalizada', href: '#contacto' },
    { label: 'Envíos Nacionales', href: '#contacto' },
    { label: 'Asesoría Privada & Fitting', href: '#contacto' },
    { label: 'Manifiesto de Marca', href: '#identidad' }
  ];
}
