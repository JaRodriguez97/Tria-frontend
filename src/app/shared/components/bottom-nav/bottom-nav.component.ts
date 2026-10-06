import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SalesService } from '../../../core/services/sales.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent implements OnInit {
  isMenuOpen: boolean = false;
  draftCount$!: Observable<number>;

  constructor(
    public router: Router,
    private salesService: SalesService,
  ) {}

  ngOnInit(): void {
    this.draftCount$ = this.salesService.draftItems$.pipe(
      map((items) => {
        let count = 0;
        for (let i = 0; i < items.length; i++) {
          count += items[i].quantity;
        }
        return count;
      })
    );
  }

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
} // sigue confirmar el flujo de las pantallas existentes y validar que pantalla puede haccer falta y ccuales tal vez sobran
