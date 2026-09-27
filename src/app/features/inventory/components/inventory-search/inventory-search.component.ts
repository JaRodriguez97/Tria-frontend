import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-inventory-search',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, TopBarComponent],
  templateUrl: './inventory-search.component.html',
  styleUrls: ['./inventory-search.component.scss']
})
export class InventorySearchComponent {

}
