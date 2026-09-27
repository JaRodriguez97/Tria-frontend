import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { ExpensesService, Expense } from '../../core/services/expenses.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, TopBarComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  selectedPeriod: 'Hoy' | 'Esta semana' | 'Este mes' = 'Esta semana';

  // New Expense Form Model
  categories: string[] = [
    'Empaques',
    'Domicilios',
    'Pauta Meta',
    'Mantenimiento',
    'Otros',
  ];
  selectedCategory: string = 'Empaques';
  expenseAmount: number = 45000;
  expenseConcept: string = 'Cintas rose gold y papel seda personalizado';
  expensePaymentSource: string = 'Efectivo Caja Menor';

  // Toast feedback
  toastVisible: boolean = false;
  toastMessage: string = '';

  constructor(public expensesService: ExpensesService) {}

  ngOnInit(): void {}

  get expenses(): Expense[] {
    return this.expensesService.getExpenses();
  }

  get totalExpenses(): number {
    return this.expensesService.getTotalExpenses();
  }

  get categoryTotals() {
    return this.expensesService.getCategoryTotals();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  selectPeriod(period: 'Hoy' | 'Esta semana' | 'Este mes'): void {
    this.selectedPeriod = period;
  }

  registerExpense(): void {
    const amount = Number(this.expenseAmount) || 0;
    if (amount <= 0) {
      alert('Ingresa un monto válido para el gasto');
      return;
    }
    if (!this.expenseConcept.trim()) {
      alert('Ingresa el concepto del gasto');
      return;
    }

    this.expensesService.addExpense({
      category: this.selectedCategory,
      concept: this.expenseConcept.trim(),
      amount: amount,
      paymentSource: this.expensePaymentSource,
    });

    this.showToastNotification(
      `-$${amount.toLocaleString('es-CO')} deducido en ${this.selectedCategory}`,
    );

    // Reset inputs to clean defaults
    this.expenseAmount = 0;
    this.expenseConcept = '';
  }

  showToastNotification(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3200);
  }
}
