import { Component } from '@angular/core';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-register-payment',
  standalone: true,
  imports: [BottomNavComponent, TopBarComponent],
  templateUrl: './register-payment.component.html',
  styleUrl: './register-payment.component.scss',
})
export class RegisterPaymentComponent {}
