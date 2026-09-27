import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-6 text-center text-on-surface">
    Cargando cuentas por cobrar...
  </div>`,
})
export class PaymentsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/app/pagos/cuentas-por-cobrar']);
  }
}
