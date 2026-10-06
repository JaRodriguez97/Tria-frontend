import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DebtAccount {
  id: string;
  saleId?: string;
  orderId: string;
  clientName: string;
  clientPhone: string;
  clientAvatar?: string;
  initials?: string;
  itemsDescription: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  lastPaymentDate: string;
  dueDate: string;
  daysRemaining?: number;
  type: 'partial' | 'full_credit';
}

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private api = inject(ApiService);
  private debtsSubject = new BehaviorSubject<DebtAccount[]>([]);
  debts$: Observable<DebtAccount[]> = this.debtsSubject.asObservable();

  private totalCollectedMonthSubject = new BehaviorSubject<number>(0);
  totalCollectedMonth$ = this.totalCollectedMonthSubject.asObservable();

  constructor() {
    this.refreshDebts();
  }

  refreshDebts(): void {
    this.api.get<{ data: DebtAccount[] }>('/receivables').subscribe({
      next: (res) => {
        if (res?.data && res.data.length > 0) {
          this.debtsSubject.next(res.data);
        }
      },
      error: () => {},
    });
  }

  getDebts(): DebtAccount[] {
    return this.debtsSubject.value;
  }

  getTotalReceivable(): number {
    return this.debtsSubject.value.reduce((acc, d) => acc + d.balance, 0);
  }

  getActiveDebtsCount(): number {
    return this.debtsSubject.value.filter((d) => d.balance > 0).length;
  }

  registerAbono(
    debtId: string,
    amount: number,
  ): { success: boolean; newBalance: number; clientName: string } {
    const debts = this.debtsSubject.value;
    const index = debts.findIndex(
      (d) => d.id === debtId || d.orderId === debtId,
    );
    if (index === -1) return { success: false, newBalance: 0, clientName: '' };

    const item = { ...debts[index] };
    const effectiveAmount = Math.min(amount, item.balance);
    item.paidAmount += effectiveAmount;
    item.balance = Math.max(0, item.balance - effectiveAmount);
    item.lastPaymentDate = 'Hoy';

    const updated = [...debts];
    updated[index] = item;
    this.debtsSubject.next(updated);

    // Increase total collected this month
    this.totalCollectedMonthSubject.next(
      this.totalCollectedMonthSubject.value + effectiveAmount,
    );

    // Enviar a la API del backend
    const targetSaleId = item.saleId || item.orderId;
    this.api.post<{ data: { newBalance: number; clientName: string } }>(
      `/sales/${targetSaleId}/payments`,
      { amount: effectiveAmount },
    ).subscribe({
      next: (res) => {
        if (res?.data) {
          item.balance = res.data.newBalance;
          this.debtsSubject.next([...this.debtsSubject.value]);
        }
      },
      error: () => {},
    });

    return {
      success: true,
      newBalance: item.balance,
      clientName: item.clientName,
    };
  }

  generateWhatsAppUrl(debt: DebtAccount): string {
    const cleanPhone = debt.clientPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('57')
      ? cleanPhone
      : `57${cleanPhone}`;
    const message = `Hola ${debt.clientName.split(' ')[0]} 😊 Te escribimos de TRÍA para recordarte que tienes un saldo pendiente de $${debt.balance.toLocaleString('es-CO')} correspondiente a tu compra de ${debt.itemsDescription}. ¡Coordinamos el pago cuando gustes! ✨`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  }
}
