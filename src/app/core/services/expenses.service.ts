import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Expense {
  id: string;
  category: string;
  concept: string;
  amount: number;
  date: Date;
  dateDisplay: string;
  paymentSource: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private api = inject(ApiService);

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  constructor() {
    this.refresh();
  }

  refresh(period: 'today' | 'week' | 'month' = 'month'): void {
    this.api.get<{ data: { expenses: Expense[]; total: number } }>(`/expenses?period=${period}`).subscribe({
      next: (res) => {
        if (res?.data?.expenses) {
          const mapped = res.data.expenses.map((e) => ({
            ...e,
            date: new Date(e.date),
          }));
          this.expensesSubject.next(mapped);
        }
      },
      error: (err) => {
        console.error('Error cargando gastos', err);
      },
    });
  }

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  addExpense(expense: Omit<Expense, 'id' | 'date' | 'dateDisplay' | 'icon'>): void {
    const expenses = this.expensesSubject.value;
    const icons: Record<string, string> = {
      Empaques: 'shopping_bag',
      Domicilios: 'local_shipping',
      'Pauta Meta': 'campaign',
      Mantenimiento: 'build',
      Otros: 'receipt_long',
    };

    // Persistir en backend primero, sin actualizar UI hasta éxito
    this.api
      .post<{ data: Expense }>('/expenses', {
        category: expense.category,
        concept: expense.concept,
        amount: expense.amount,
        paymentSource: expense.paymentSource,
      })
      .subscribe({
        next: (res) => {
          if (res?.data?.id) {
            const current = this.expensesSubject.value;
            const expenseFromServer: Expense = {
              ...res.data,
              date: new Date(res.data.date),
              dateDisplay: 'Reciente',
              icon: icons[res.data.category] || 'receipt_long',
            };
            this.expensesSubject.next([expenseFromServer, ...current]);
          }
        },
        error: (err) => {
          console.error('Error añadiendo gasto', err);
        },
      });
  }

  getTotalExpenses(): number {
    return this.expensesSubject.value.reduce((acc, e) => acc + e.amount, 0);
  }

  getCategoryTotals(): { category: string; amount: number; percentage: number; colorClass: string }[] {
    const expenses = this.expensesSubject.value;
    const total = this.getTotalExpenses() || 1;
    const categories = ['Empaques', 'Pauta Meta', 'Domicilios', 'Otros'];
    const colorClasses: Record<string, string> = {
      Empaques: 'bg-primary',
      'Pauta Meta': 'bg-primary-container',
      Domicilios: 'bg-secondary',
      Otros: 'bg-outline',
    };

    return categories.map((cat) => {
      const catSum = expenses
        .filter((e) => e.category.toLowerCase().includes(cat.toLowerCase().split(' ')[0]))
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = Math.round((catSum / total) * 100);
      return {
        category: cat,
        amount: catSum,
        percentage,
        colorClass: colorClasses[cat] || 'bg-primary',
      };
    });
  }
}

