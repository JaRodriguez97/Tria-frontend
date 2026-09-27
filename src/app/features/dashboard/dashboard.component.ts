import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent, TopBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  metrics$ = this.dashboardService.metrics$;
  topProducts$ = this.dashboardService.topProducts$;
  activityLog$ = this.dashboardService.activityLog$;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}
}
