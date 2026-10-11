import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  private api = inject(ApiService);
  private metricsSubject = new BehaviorSubject<DashboardMetrics>({
    totalSales: 0,
    salesGrowth: 0,
    moneyCollected: 0,
    closingRate: 0,
    grossMargin: 0,
    totalCost: 0,
    marginPercentage: 0,
    netProfit: 0,
    totalExpenses: 0,
    returnPercentage: 0,
    pendingCollection: 0,
    pendingClientsCount: 0,
    globalInventory: {
      availableItems: 0,
      totalCostValue: 0,
      potentialValue: 0
    }
  });

  private topProductsSubject = new BehaviorSubject<TopProduct[]>([]);

  private activityLogSubject = new BehaviorSubject<ActivityLog[]>([]);

  metrics$ = this.metricsSubject.asObservable();
  topProducts$ = this.topProductsSubject.asObservable();
  activityLog$ = this.activityLogSubject.asObservable();

  constructor() {
    this.refresh();
  }

  refresh(period: 'today' | 'week' | 'month' | 'year' = 'today'): void {
    this.api
      .get<{
        data: {
          metrics: DashboardMetrics;
          topProducts: TopProduct[];
          activityLog: ActivityLog[];
        }
      }>(`/dashboard?period=${period}`)
      .subscribe({
        next: (res) => {
          if (res?.data) {
            const { metrics, topProducts, activityLog } = res.data;
            if (metrics) this.metricsSubject.next(metrics);
            if (topProducts) this.topProductsSubject.next(topProducts);
            if (activityLog) this.activityLogSubject.next(activityLog);
          }
        },
        error: (err) => {
          console.error('Error fetching dashboard data', err);
        },
      });
  }
}

