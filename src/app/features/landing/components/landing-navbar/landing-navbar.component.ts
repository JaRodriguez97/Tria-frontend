import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-navbar.component.html',
})
export class LandingNavbarComponent {
  isMobileMenuOpen = false;

  navItems = [
    { label: 'Inicio', href: '#inicio', isPageAnchor: true },
    { label: 'Colecciones', href: '#colecciones', isPageAnchor: false },
    { label: 'Selección', href: '#seleccion', isPageAnchor: false },
    { label: 'Beneficios', href: '#beneficios', isPageAnchor: false },
    { label: 'Contacto', href: '#contacto', isPageAnchor: false }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  scrollToSection(event: Event, href: string): void {
    if (href.startsWith('#')) {
      event.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.navItems.forEach((item) => {
        item.isPageAnchor = item.href === href;
      });
      this.closeMobileMenu();
    }
  }
}
