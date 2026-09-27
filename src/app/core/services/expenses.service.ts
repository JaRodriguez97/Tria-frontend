import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private initialExpenses: Expense[] = [
    {
      id: 'EXP-001',
      category: 'Empaques',
      concept: 'Empaques boutique y papel seda',
      amount: 45000,
      date: new Date(),
      dateDisplay: 'Hoy · 2:15 PM',
      paymentSource: 'Caja Menor',
      icon: 'shopping_bag',
    },
    {
      id: 'EXP-002',
      category: 'Domicilios',
      concept: 'Envíos nacionales Servientrega',
      amount: 30000,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      dateDisplay: 'Ayer · 11:30 AM',
      paymentSource: 'Bancolombia',
      icon: 'local_shipping',
    },
    {
      id: 'EXP-003',
      category: 'Pauta Meta',
      concept: 'Pauta Meta Campaña Perfumes',
      amount: 70000,
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      dateDisplay: '07 Sep · 09:00 AM',
      paymentSource: 'Tarjeta Débito',
      icon: 'campaign',
    },
    {
      id: 'EXP-004',
      category: 'Mantenimiento',
      concept: 'Mantenimiento máquina de coser taller',
      amount: 50000,
      date: new Date(Date.now() - 72 * 60 * 60 * 1000),
      dateDisplay: '05 Sep · 04:00 PM',
      paymentSource: 'Caja Menor',
      icon: 'build',
    },
    {
      id: 'EXP-005',
      category: 'Otros',
      concept: 'Cafetería & amenidades clientas atelier',
      amount: 50000,
      date: new Date(Date.now() - 96 * 60 * 60 * 1000),
      dateDisplay: '03 Sep · 10:15 AM',
      paymentSource: 'Caja Menor',
      icon: 'local_cafe',
    },
  ];

  private expensesSubject = new BehaviorSubject<Expense[]>(this.initialExpenses);
  expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  constructor() {}

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  addExpense(expense: Omit<Expense, 'id' | 'date' | 'dateDisplay' | 'icon'>): Expense {
    const expenses = this.expensesSubject.value;
    const icons: Record<string, string> = {
      'Empaques': 'shopping_bag',
      'Domicilios': 'local_shipping',
      'Pauta Meta': 'campaign',
      'Mantenimiento': 'build',
      'Otros': 'receipt_long',
    };

    const newExpense: Expense = {
      ...expense,
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      date: new Date(),
      dateDisplay: 'Hoy · Reciente',
      icon: icons[expense.category] || 'receipt_long',
    };

    this.expensesSubject.next([newExpense, ...expenses]);
    return newExpense;
  }

  getTotalExpenses(): number {
    return this.expensesSubject.value.reduce((acc, e) => acc + e.amount, 0);
  }

  getCategoryTotals(): { category: string; amount: number; percentage: number; colorClass: string }[] {
    const expenses = this.expensesSubject.value;
    const total = this.getTotalExpenses() || 1;
    const categories = ['Empaques', 'Pauta Meta', 'Domicilios', 'Otros'];
    const colorClasses: Record<string, string> = {
      'Empaques': 'bg-primary',
      'Pauta Meta': 'bg-primary-container',
      'Domicilios': 'bg-secondary',
      'Otros': 'bg-outline',
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
