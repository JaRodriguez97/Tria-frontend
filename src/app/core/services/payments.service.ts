import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DebtAccount {
  id: string;
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
  private initialDebts: DebtAccount[] = [
    {
      id: 'DEBT-001',
      orderId: '0012',
      clientName: 'María Rodríguez',
      clientPhone: '300 123 4567',
      // clientAvatar:
      // 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFKVn21WVNb9BIWbo9jh9zg3zN0B0QtC6O2Sff7x_XQIw8JU7JA8XMiAcO-9lt6UxdwFewnPHq4ARKnf80KXz1CvhI-eBYD2dkLNQdZhg4SRjNccufqzMtxPpFRq0K6HMPZStv2cAyMoVQv--XCaQMlhGsQyTWtqNxgmSE6hGkJ12Miy1wJAMwkQL9dM-2Zbb7o2Ysl7sFgYyW7zOWy2h8IKiN43ADhc06tKHd3PcSMSXlZs8eVUHh',
      itemsDescription: 'Vestido Seda & Perfume',
      totalAmount: 120000,
      paidAmount: 50000,
      balance: 70000,
      lastPaymentDate: '09 Sep',
      dueDate: '12 Sep',
      daysRemaining: 3,
      type: 'partial',
    },
    {
      id: 'DEBT-002',
      orderId: '0015',
      clientName: 'Valentina Gómez',
      clientPhone: '312 987 6543',
      initials: 'VG',
      itemsDescription: 'Bralette Seda Blanco & Panty',
      totalAmount: 130000,
      paidAmount: 90000,
      balance: 40000,
      lastPaymentDate: '12 Sep',
      dueDate: '19 Sep',
      daysRemaining: 7,
      type: 'partial',
    },
    {
      id: 'DEBT-003',
      orderId: '0018',
      clientName: 'Camila Torres',
      clientPhone: '320 456 7890',
      initials: 'CT',
      itemsDescription: 'Body Encaje Floral',
      totalAmount: 150000,
      paidAmount: 125000,
      balance: 25000,
      lastPaymentDate: '15 Sep',
      dueDate: '20 Sep',
      daysRemaining: 5,
      type: 'partial',
    },
    {
      id: 'DEBT-004',
      orderId: '0021',
      clientName: 'Sofía Vergara',
      clientPhone: '301 555 1234',
      initials: 'SV',
      itemsDescription: 'Colección Seda Edición Limitada',
      totalAmount: 350000,
      paidAmount: 330000,
      balance: 20000,
      lastPaymentDate: '18 Sep',
      dueDate: '30 Sep',
      daysRemaining: 12,
      type: 'full_credit',
    },
  ];

  private debtsSubject = new BehaviorSubject<DebtAccount[]>(this.initialDebts);
  debts$: Observable<DebtAccount[]> = this.debtsSubject.asObservable();

  private totalCollectedMonthSubject = new BehaviorSubject<number>(1195000);
  totalCollectedMonth$ = this.totalCollectedMonthSubject.asObservable();

  constructor() {}

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
