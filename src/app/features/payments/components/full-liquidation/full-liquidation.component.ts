import { Component } from '@angular/core';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-full-liquidation',
  standalone: true,
  imports: [BottomNavComponent, TopBarComponent],
  templateUrl: './full-liquidation.component.html',
  styleUrl: './full-liquidation.component.scss'
})
export class FullLiquidationComponent {

}
