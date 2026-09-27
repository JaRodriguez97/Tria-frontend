import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './inventory.service';

export interface SaleItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  date: Date;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private salesSubject = new BehaviorSubject<Sale[]>([
    {
      id: 'VNT-001',
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      items: [],
      total: 240000,
      paymentMethod: 'Transferencia'
    },
    {
      id: 'VNT-002',
      date: new Date(), // Today
      items: [],
      total: 150000,
      paymentMethod: 'Efectivo'
    }
  ]);
  
  sales$ = this.salesSubject.asObservable();

  constructor() {}

  getSales(): Sale[] {
    return this.salesSubject.value;
  }

  addSale(items: SaleItem[], paymentMethod: string): Sale {
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);
    const currentSales = this.salesSubject.value;
    
    const newSale: Sale = {
      id: `VNT-${String(currentSales.length + 1).padStart(3, '0')}`,
      date: new Date(),
      items: [...items],
      total,
      paymentMethod
    };
    
    this.salesSubject.next([newSale, ...currentSales]);
    return newSale;
  }
}
