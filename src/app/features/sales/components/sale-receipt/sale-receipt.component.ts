import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';
import { SalesService, Sale } from '../../../../core/services/sales.service';

@Component({
  selector: 'app-sale-receipt',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, TopBarComponent],
  templateUrl: './sale-receipt.component.html',
  styleUrl: './sale-receipt.component.scss',
})
export class SaleReceiptComponent implements OnInit {
  sale: Sale | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const saleId = params['saleId'];
      if (saleId) {
        this.sale = this.salesService.getSaleById(saleId) || null;
      }
      if (!this.sale) {
        // Cargar la última venta registrada
        const sales = this.salesService.getSales();
        this.sale = sales.length > 0 ? sales[0] : null;
      }
    });
  }

  get totalItemsCount(): number {
    if (!this.sale || !this.sale.items) return 0;
    return this.sale.items.reduce((acc, i) => acc + i.quantity, 0);
  }

  get clientInitials(): string {
    if (!this.sale?.clientName) return 'MR';
    return this.sale.clientName.substring(0, 2).toUpperCase();
  }

  get whatsAppUrl(): string {
    if (!this.sale) return '';
    const phone = this.sale.clientPhone
      ? this.sale.clientPhone.replace(/\D/g, '')
      : '';
    const cleanPhone = phone
      ? phone.startsWith('57')
        ? phone
        : `57${phone}`
      : '573001234567';
    const clientFirstName = this.sale.clientName
      ? this.sale.clientName.split(' ')[0]
      : 'Clienta';
    const totalFormatted = (this.sale.total || 0).toLocaleString('es-CO');
    const abonoFormatted = (this.sale.abono || 0).toLocaleString('es-CO');
    const pendingFormatted = (this.sale.pendingBalance || 0).toLocaleString(
      'es-CO',
    );

    const message = `Hola ${clientFirstName} ✨ Te enviamos tu comprobante de compra #${this.sale.id} en TRÍA:\n• Total: $${totalFormatted} COP\n• Abono recibido: $${abonoFormatted} COP\n• Saldo pendiente: $${pendingFormatted} COP\n¡Muchas gracias por tu compra en nuestra boutique! 💖`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  goToNewSale() {
    this.router.navigate(['/app/ventas/rapida']);
  }

  goToSaleDetails() {
    if (this.sale) {
      this.router.navigate(['/app/ventas/detalle'], {
        queryParams: { saleId: this.sale.id },
      });
    } else {
      this.router.navigate(['/app/ventas']);
    }
  }

  goToAccountsReceivable() {
    this.router.navigate(['/app/pagos/cuentas-por-cobrar']);
  }
}
