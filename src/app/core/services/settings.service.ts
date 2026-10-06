import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InventoryService } from './inventory.service';
import { SalesService } from './sales.service';

export interface BoutiqueSettings {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  targetMargin: number;
  gracePeriodDays: number;
  criticalStockThreshold: number;
  whatsappTemplate: string;
  lastSyncDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(ApiService);
  private inventory = inject(InventoryService);
  private sales = inject(SalesService);

  private defaultSettings: BoutiqueSettings = {
    storeName: 'Administración General TRÍA',
    email: 'administracion@tria.co',
    phone: '+57 314 890 2134',
    currency: 'COP ($)',
    targetMargin: 55,
    gracePeriodDays: 15,
    criticalStockThreshold: 3,
    whatsappTemplate:
      'Hola, [Clienta] 😊 Te escribimos de TRÍA Boutique para recordarte que tienes un saldo pendiente de [Saldo] de tu compra de [Productos]. ¡Coordinamos cuando gustes! ✨',
    lastSyncDate: new Date(),
  };

  private settingsSubject = new BehaviorSubject<BoutiqueSettings>(this.defaultSettings);
  settings$: Observable<BoutiqueSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.api.get<{ data: BoutiqueSettings }>('/settings').subscribe({
      next: (res) => {
        if (res?.data) {
          this.settingsSubject.next({
            ...this.defaultSettings,
            ...res.data,
            lastSyncDate: new Date(res.data.lastSyncDate || Date.now()),
          });
        }
      },
      error: () => {
        // Fallback a configuración local
      },
    });
  }

  getSettings(): BoutiqueSettings {
    return this.settingsSubject.value;
  }

  updateSettings(partial: Partial<BoutiqueSettings>): void {
    const updated = {
      ...this.settingsSubject.value,
      ...partial,
      lastSyncDate: new Date(),
    };
    this.settingsSubject.next(updated);

    // Persistir en backend
    this.api.patch<{ data: BoutiqueSettings }>('/settings', partial).subscribe({
      next: (res) => {
        if (res?.data) {
          this.settingsSubject.next({
            ...this.settingsSubject.value,
            ...res.data,
            lastSyncDate: new Date(res.data.lastSyncDate || Date.now()),
          });
        }
      },
      error: () => {
        // Mantiene actualización local
      },
    });
  }

  updateWhatsappTemplate(newTemplate: string): void {
    this.updateSettings({ whatsappTemplate: newTemplate });
  }

  triggerCloudSync(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.api.get<{ data: BoutiqueSettings }>('/settings').subscribe({
        next: (res) => {
          if (res?.data) {
            this.settingsSubject.next({
              ...this.settingsSubject.value,
              ...res.data,
              lastSyncDate: new Date(),
            });
          }
          subscriber.next(true);
          subscriber.complete();
        },
        error: () => {
          this.settingsSubject.next({
            ...this.settingsSubject.value,
            lastSyncDate: new Date(),
          });
          subscriber.next(true);
          subscriber.complete();
        },
      });
    });
  }

  downloadCatalogCSV(): void {
    if (typeof window === 'undefined') return;
    const products = this.inventory.getProducts();
    let csvContent = 'SKU,Nombre,Categoría,Precio_COP,Stock,Estado\n';
    products.forEach(p => {
      // Usar comillas dobles para escapar comas en los nombres
      const name = `"${p.name.replace(/"/g, '""')}"`;
      csvContent += `${p.sku},${name},${p.category},${p.price},${p.stock},${p.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `catalogo_tria_boutique_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadLedgerCSV(): void {
    if (typeof window === 'undefined') return;
    const salesList = this.sales.getSales();
    let csvContent = 'Orden,Clienta,Teléfono,Método,Total_COP,Abonado_COP,Saldo_COP\n';
    salesList.forEach(s => {
      const clientName = `"${(s.clientName || 'Ocasional').replace(/"/g, '""')}"`;
      const phone = `"${(s.clientPhone || '').replace(/"/g, '""')}"`;
      csvContent += `${s.id},${clientName},${phone},${s.paymentMethod},${s.total},${s.abono || 0},${s.pendingBalance || 0}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `balance_cartera_tria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
