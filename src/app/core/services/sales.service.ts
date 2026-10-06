import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './inventory.service';
import { ApiService } from './api.service';

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
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  mode?: 'full' | 'abono' | 'fiado';
  abono?: number;
  pendingBalance?: number;
  nextPaymentDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private api = inject(ApiService);
  private salesSubject = new BehaviorSubject<Sale[]>([]);

  sales$ = this.salesSubject.asObservable();

  // Borrador compartido para selección multi-producto en inventario y venta rápida
  private draftItemsSubject = new BehaviorSubject<SaleItem[]>([]);
  draftItems$ = this.draftItemsSubject.asObservable();

  constructor() {
    this.loadSales();
  }

  loadSales(): void {
    this.api.get<{ data: Sale[] }>('/sales').subscribe({
      next: (res) => {
        if (res?.data) {
          const mapped = res.data.map((s) => ({
            ...s,
            date: new Date(s.date),
          }));
          this.salesSubject.next(mapped);
        }
      },
      error: (err) => console.error('Error cargando ventas:', err),
    });
  }

  getSales(): Sale[] {
    return this.salesSubject.value;
  }

  getSaleById(id: string): Sale | undefined {
    return this.salesSubject.value.find((s) => s.id === id);
  }

  // Métodos de borrador / selección
  getDraftItems(): SaleItem[] {
    return this.draftItemsSubject.value;
  }

  getDraftItem(productId: string): SaleItem | undefined {
    return this.draftItemsSubject.value.find((i) => i.product.id === productId);
  }

  addToDraft(product: Product, quantity: number = 1): void {
    const current = this.draftItemsSubject.value;
    const index = current.findIndex((i) => i.product.id === product.id);
    if (index > -1) {
      const existing = current[index];
      const newQty = Math.min(product.stock, existing.quantity + quantity);
      const updated = [...current];
      updated[index] = {
        ...existing,
        quantity: newQty,
        subtotal: newQty * product.price,
      };
      this.draftItemsSubject.next(updated);
    } else {
      const initialQty = Math.min(product.stock, Math.max(1, quantity));
      this.draftItemsSubject.next([
        ...current,
        {
          product,
          quantity: initialQty,
          subtotal: initialQty * product.price,
        },
      ]);
    }
  }

  updateDraftQty(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromDraft(productId);
      return;
    }
    const current = this.draftItemsSubject.value;
    const index = current.findIndex((i) => i.product.id === productId);
    if (index === -1) return;
    const item = current[index];
    const newQty = Math.min(item.product.stock, quantity);
    const updated = [...current];
    updated[index] = {
      ...item,
      quantity: newQty,
      subtotal: newQty * item.product.price,
    };
    this.draftItemsSubject.next(updated);
  }

  removeFromDraft(productId: string): void {
    const filtered = this.draftItemsSubject.value.filter(
      (i) => i.product.id !== productId,
    );
    this.draftItemsSubject.next(filtered);
  }

  clearDraft(): void {
    this.draftItemsSubject.next([]);
  }

  getDraftTotal(): number {
    return this.draftItemsSubject.value.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
  }

  getDraftCount(): number {
    return this.draftItemsSubject.value.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  }

  addSale(
    items: SaleItem[],
    paymentMethod: string,
    options?: {
      clientId?: string;
      clientName?: string;
      clientPhone?: string;
      mode?: 'full' | 'abono' | 'fiado';
      abono?: number;
      pendingBalance?: number;
      nextPaymentDate?: string;
    },
  ): Observable<Sale> {
    const currentSales = this.salesSubject.value;

    // Enviar a la API del backend sin UI optimista
    const apiPayload = {
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      mode: options?.mode || 'full',
      paymentMethod,
      clientId: options?.clientId && options.clientId !== 'anon' ? options.clientId : undefined,
      abono: options?.abono,
      nextPaymentDate: options?.nextPaymentDate,
    };

    return new Observable<Sale>((subscriber) => {
      this.api.post<{ data: Sale }>('/sales', apiPayload).subscribe({
        next: (res) => {
          if (res?.data) {
            const s = res.data;
            const newSale: Sale = {
              ...s,
              date: new Date(s.date),
            };
            this.salesSubject.next([newSale, ...currentSales]);
            this.clearDraft();
            subscriber.next(newSale);
            subscriber.complete();
          }
        },
        error: (err) => {
          console.error('Error creando venta:', err);
          subscriber.error(err);
        },
      });
    });
  }
}
