import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() {}

  getSettings(): BoutiqueSettings {
    return this.settingsSubject.value;
  }

  updateSettings(partial: Partial<BoutiqueSettings>): void {
    this.settingsSubject.next({
      ...this.settingsSubject.value,
      ...partial,
    });
  }

  updateWhatsappTemplate(newTemplate: string): void {
    this.settingsSubject.next({
      ...this.settingsSubject.value,
      whatsappTemplate: newTemplate,
    });
  }

  triggerCloudSync(): Observable<boolean> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        this.settingsSubject.next({
          ...this.settingsSubject.value,
          lastSyncDate: new Date(),
        });
        subscriber.next(true);
        subscriber.complete();
      }, 1000);
    });
  }

  downloadCatalogCSV(): void {
    if (typeof window === 'undefined') return;
    const csvContent =
      'SKU,Nombre,Categoría,Precio_COP,Stock,Estado\n' +
      'LNC-001,Conjunto Lencería Encaje Negro,Conjuntos,120000,15,Activo\n' +
      'BRL-002,Bralette Seda Blanco,Bralettes,85000,8,Activo\n' +
      'PNT-003,Panty Tiro Alto Clásico,Panties,45000,24,Activo\n' +
      'BDY-004,Body Encaje Floral,Bodys,150000,5,Activo\n' +
      'PJM-005,Pijama Satín Dos Piezas,Pijamas,180000,12,Activo\n';

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
    const csvContent =
      'Orden,Clienta,Teléfono,Concepto,Total_COP,Abonado_COP,Saldo_COP,Estado\n' +
      '0012,María Rodríguez,+57 300 123 4567,Vestido Seda & Perfume,120000,50000,70000,Pendiente\n' +
      '0015,Valentina Gómez,+57 312 987 6543,Bralette Seda Blanco & Panty,130000,90000,40000,Pendiente\n' +
      '0018,Camila Torres,+57 320 456 7890,Body Encaje Floral,150000,125000,25000,Pendiente\n' +
      '0021,Sofía Vergara,+57 301 555 1234,Colección Seda Edición Limitada,350000,330000,20000,Pendiente\n' +
      '0008,Isabella Restrepo,+57 310 888 9900,Pijama Satín Dos Piezas,180000,180000,0,Paz y Salvo\n';

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
