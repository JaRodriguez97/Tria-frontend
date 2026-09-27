import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService, SaleItem } from '../../../../core/services/sales.service';
import { InventoryService } from '../../../../core/services/inventory.service';

@Component({
  selector: 'app-quick-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-sale.component.html',
  styleUrl: './quick-sale.component.scss'
})
export class QuickSaleComponent implements OnInit, OnDestroy {
  currentQty = 1;
  unitPrice = 120000;
  currentMode: 'full' | 'abono' | 'fiado' = 'abono';
  abonoInput = 50000;
  
  isSaving = false;
  isSaved = false;
  timerSeconds = 14;
  private timerInterval: any;

  // Mocked product for the UI visual
  selectedProduct: any = {
    id: '3',
    name: 'Perfume Yara Onlyou',
    sku: '#024',
    category: 'Fragancia',
    price: 120000,
    stock: 3
  };

  constructor(
    private router: Router,
    private salesService: SalesService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  get currentTotal(): number {
    return this.unitPrice * this.currentQty;
  }

  get abono(): number {
    if (this.currentMode === 'full') return this.currentTotal;
    if (this.currentMode === 'fiado') return 0;
    
    let val = this.abonoInput || 0;
    if (val > this.currentTotal) val = this.currentTotal;
    if (val < 0) val = 0;
    return val;
  }

  get pending(): number {
    return this.currentTotal - this.abono;
  }

  setPaymentMode(mode: 'full' | 'abono' | 'fiado') {
    this.currentMode = mode;
    if (mode === 'full') {
      this.abonoInput = this.currentTotal;
    } else if (mode === 'abono') {
      if (!this.abonoInput || this.abonoInput === 0) {
        this.abonoInput = 50000;
      }
    } else if (mode === 'fiado') {
      this.abonoInput = 0;
    }
  }

  setAbonoAmount(val: number) {
    this.abonoInput = val;
  }

  incQty() {
    if (this.currentQty < 3) this.currentQty++;
  }

  decQty() {
    if (this.currentQty > 1) this.currentQty--;
  }

  confirmSale() {
    this.isSaving = true;
    
    const item: SaleItem = {
      product: this.selectedProduct as any,
      quantity: this.currentQty,
      subtotal: this.currentTotal
    };

    setTimeout(() => {
      this.isSaved = true;
      const paymentMethodStr = this.currentMode === 'full' ? 'Efectivo (Total)' : (this.currentMode === 'abono' ? 'Abono' : 'Fiado');
      const sale = this.salesService.addSale([item], paymentMethodStr);
      
      setTimeout(() => {
        // Redirigir al recibo o historial. Ajusta la ruta según tus componentes
        this.router.navigate(['/app/ventas']);
      }, 1500);
    }, 900);
  }

  get formattedTimer(): string {
    return `00:${this.timerSeconds < 10 ? '0' : ''}${this.timerSeconds}s`;
  }
}
