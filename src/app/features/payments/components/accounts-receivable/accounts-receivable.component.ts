import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';
import {
  PaymentsService,
  DebtAccount,
} from '../../../../core/services/payments.service';

@Component({
  selector: 'app-accounts-receivable',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, TopBarComponent],
  templateUrl: './accounts-receivable.component.html',
  styleUrl: './accounts-receivable.component.scss',
})
export class AccountsReceivableComponent implements OnInit {
  activeFilter: 'all' | 'partial' | 'unpaid' | 'settled' = 'all';

  // Bottom Sheet State
  isSheetOpen: boolean = false;
  selectedDebt: DebtAccount | null = null;
  paymentInput: number = 0;

  // Toast
  toastVisible: boolean = false;
  toastMessage: string = '';

  constructor(public paymentsService: PaymentsService) {}

  ngOnInit(): void {}

  get debts(): DebtAccount[] {
    return this.paymentsService.getDebts();
  }

  get filteredDebts(): DebtAccount[] {
    if (this.activeFilter === 'partial') {
      return this.debts.filter((d) => d.paidAmount > 0 && d.balance > 0);
    } else if (this.activeFilter === 'unpaid') {
      return this.debts.filter((d) => d.paidAmount === 0 && d.balance > 0);
    } else if (this.activeFilter === 'settled') {
      return this.debts.filter((d) => d.balance === 0);
    }
    return this.debts;
  }

  get totalReceivable(): number {
    return this.paymentsService.getTotalReceivable();
  }

  get activeDebtsCount(): number {
    return this.paymentsService.getActiveDebtsCount();
  }

  get partialDebtsCount(): number {
    return this.debts.filter((d) => d.paidAmount > 0 && d.balance > 0).length;
  }

  get unpaidDebtsCount(): number {
    return this.debts.filter((d) => d.paidAmount === 0 && d.balance > 0).length;
  }

  get settledDebtsCount(): number {
    return this.debts.filter((d) => d.balance === 0).length;
  }

  get recoveryRate(): number {
    const active = this.debts.filter((d) => d.balance > 0);
    if (active.length === 0) return 100;
    const onTime = active.filter((d) => (d.daysRemaining ?? 0) >= 0).length;
    return Math.round((onTime / active.length) * 100);
  }

  setFilter(filter: 'all' | 'partial' | 'unpaid' | 'settled'): void {
    this.activeFilter = filter;
  }

  openPaymentSheet(debt: DebtAccount): void {
    this.selectedDebt = debt;
    this.paymentInput = Math.min(20000, debt.balance);
    this.isSheetOpen = true;
  }

  closePaymentSheet(): void {
    this.isSheetOpen = false;
    this.selectedDebt = null;
  }

  setPaymentAmount(delta: number): void {
    if (!this.selectedDebt) return;
    this.paymentInput = Math.min(
      this.selectedDebt.balance,
      (this.paymentInput || 0) + delta,
    );
  }

  setFullBalance(): void {
    if (!this.selectedDebt) return;
    this.paymentInput = this.selectedDebt.balance;
  }

  get newCalculatedBalance(): number {
    if (!this.selectedDebt) return 0;
    return Math.max(0, this.selectedDebt.balance - (this.paymentInput || 0));
  }

  confirmPayment(): void {
    if (!this.selectedDebt || this.paymentInput <= 0) return;

    this.paymentsService.registerAbono(
      this.selectedDebt.id,
      this.paymentInput,
    ).subscribe({
      next: (res) => {
        if (res.success) {
          const amountFormatted = this.paymentInput.toLocaleString('es-CO');
          this.closePaymentSheet();
          this.showToastNotification(
            `¡Abono de $${amountFormatted} registrado con éxito en TRÍA!`,
          );
        }
      },
      error: () => {
        alert('Hubo un error al registrar el abono. Intenta de nuevo.');
      }
    });
  }

  showToastNotification(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3200);
  }

  getWhatsAppUrl(debt: DebtAccount): string {
    return this.paymentsService.generateWhatsAppUrl(debt);
  }

  copyWhatsAppText(debt: DebtAccount): void {
    const text = `Hola ${debt.clientName.split(' ')[0]} 😊 Te escribimos de TRÍA para recordarte que tienes un saldo pendiente de $${debt.balance.toLocaleString('es-CO')} correspondiente a tu compra de ${debt.itemsDescription}. ¡Coordinamos el pago cuando gustes! ✨`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.showToastNotification('Mensaje copiado al portapapeles');
    }
  }
}
