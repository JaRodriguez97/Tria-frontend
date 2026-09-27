import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {
  isMenuOpen: boolean = false;

  constructor(public router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isMoreActive(): boolean {
    const url = this.router.url;
    return (
      url.includes('/app/compras') ||
      url.includes('/app/gastos') ||
      url.includes('/app/reportes')
    );
  }
}  // sigue confirmar el flujo de las pantallas existentes y validar que pantalla puede haccer falta y ccuales tal vez sobran
