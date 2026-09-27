import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DashboardMetrics {
  totalSales: number;
  salesGrowth: number;
  moneyCollected: number;
  closingRate: number;
  grossMargin: number;
  totalCost: number;
  marginPercentage: number;
  netProfit: number;
  totalExpenses: number;
  returnPercentage: number;
  pendingCollection: number;
  pendingClientsCount: number;
  globalInventory: {
    availableItems: number;
    totalCostValue: number;
    potentialValue: number;
  };
}

export interface TopProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  unitsSold: number;
}

export interface ActivityLog {
  id: string;
  type: 'sale' | 'payment' | 'expense';
  title: string;
  description: string;
  amount: number;
  timeAgo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private metricsSubject = new BehaviorSubject<DashboardMetrics>({
    totalSales: 1280000,
    salesGrowth: 14,
    moneyCollected: 1195000,
    closingRate: 93.3,
    grossMargin: 760000,
    totalCost: 520000,
    marginPercentage: 59,
    netProfit: 660000,
    totalExpenses: 100000,
    returnPercentage: 51.5,
    pendingCollection: 85000,
    pendingClientsCount: 4,
    globalInventory: {
      availableItems: 142,
      totalCostValue: 1850000,
      potentialValue: 2420000
    }
  });

  private topProductsSubject = new BehaviorSubject<TopProduct[]>([
    {
      id: '1',
      name: 'Perfume Yara Eau de Parfum',
      description: '$25.000 · Fragancia Signature',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDogZwb7p-CIaFc-67GdFde3pInKx3rKQD_4IdgORMJysVuI8gEpAGDlKXwK1vQfktkvjcXk1Os7k_A2WdCJUK619yF5WYzwAtdlEdHXHILnSefLynjk1J7sIOE1oKd6oaZfUwx0fmgJmpX1I0ayyMXrwxiTegKcNJlymB7zJxFHs9oGKPOvkky9ET_MBBZVrjD3pVT_0y7rdGJKAkWttnFe-WECh3rQ_-wfHG8PDD4lX1kUHV6igP5',
      unitsSold: 14
    },
    {
      id: '2',
      name: 'Vestido Satinado Noir',
      description: '$80.000 · Colección Noche',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKuRAKCwAgu3qVH2TeFw1BFZLMRJjE7lGu-wfOBaE3D_N8K4Jtg71DPu_2fL6f2Wo6zLg62YA4meqQtyUjKpraUyWimxbcoPMYLhLRQYA-w6QlFt-gsogl0oDw7zOQUFO-D-9yxFb2Uc6eFj_ilseA76zSdmUY2dX7aa_Ll2qMOOZ7gJgheHo2-8ns9lDkebM9Wc3LGteJU2oj5j3UBG4KSV5Dt7OXm6JHvjl2IW6npE74B0pltIrc',
      unitsSold: 6
    },
    {
      id: '3',
      name: 'Body Encaje Noir Couture',
      description: '$45.000 · Lencería Fina',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe4DdxPHJWiJnAkpFPYVHO3QIbrTtS0TqsrsZetzLGdq7xLbCjVMmU5JL7fFCBtNk-h8uZyfIsf6Me1oI5x1M1MHy4di4Gh_nCY5BXVv_-7Q-nX1XbjUydE7JttE9yXTeNr39F3cp0ktcdLzV3NbVlcwwHFxwx5sj-6b0oGJUwSDVkZaA-XunuFf5YImnIMoGqbP6tqmez7Hxh6pz9SyDIUpzWEJiCIAAY_J0N5V7JQhbwLwpRXKVZ',
      unitsSold: 8
    }
  ]);

  private activityLogSubject = new BehaviorSubject<ActivityLog[]>([
    {
      id: '1',
      type: 'sale',
      title: 'Venta Contado · Sofía Morales',
      description: '1x Vestido Satinado Noir',
      amount: 80000,
      timeAgo: 'Hace 18 min'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Abono Recibido · Valentina Ríos',
      description: 'Transferencia Bancolombia',
      amount: 25000,
      timeAgo: 'Hace 42 min'
    },
    {
      id: '3',
      type: 'expense',
      title: 'Gasto Operativo · Empaques de Seda',
      description: 'Caja Menor',
      amount: -45000,
      timeAgo: 'Hace 2 horas'
    }
  ]);

  metrics$ = this.metricsSubject.asObservable();
  topProducts$ = this.topProductsSubject.asObservable();
  activityLog$ = this.activityLogSubject.asObservable();

  constructor() {}
}
