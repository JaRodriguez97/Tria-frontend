import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import {
  PaymentsService,
  DebtAccount,
} from '../../core/services/payments.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent, TopBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  metrics$ = this.dashboardService.metrics$;
  topProducts$ = this.dashboardService.topProducts$;
  activityLog$ = this.dashboardService.activityLog$;

  currentDate = new Date();
  activePeriod: 'today' | 'week' | 'month' | 'custom' = 'today';

  priorityDebt$: Observable<DebtAccount | undefined>;

  get greeting(): string {
    const hour = this.currentDate.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  constructor(
    private dashboardService: DashboardService,
    private paymentsService: PaymentsService,
  ) {
    this.priorityDebt$ = this.paymentsService.debts$.pipe(
      map((debts) => debts.find((d) => d.balance > 0)),
    );
  }

  ngOnInit(): void {}

  setPeriod(period: 'today' | 'week' | 'month' | 'custom') {
    this.activePeriod = period;
    if (period !== 'custom') {
      this.dashboardService.refresh(period);
    }
  }

  getWhatsAppLink(debt: DebtAccount): string {
    return this.paymentsService.generateWhatsAppUrl(debt);
  }
}
