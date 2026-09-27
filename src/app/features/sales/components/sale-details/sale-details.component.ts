import { Component } from '@angular/core';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [BottomNavComponent, TopBarComponent],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.scss'
})
export class SaleDetailsComponent {

}
