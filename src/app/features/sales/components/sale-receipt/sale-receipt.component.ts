import { Component } from '@angular/core';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-sale-receipt',
  standalone: true,
  imports: [BottomNavComponent, TopBarComponent],
  templateUrl: './sale-receipt.component.html',
  styleUrl: './sale-receipt.component.scss'
})
export class SaleReceiptComponent {

}
