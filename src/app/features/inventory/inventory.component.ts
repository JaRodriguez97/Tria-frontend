import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InventoryService, Product } from '../../core/services/inventory.service';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, BottomNavComponent, TopBarComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  products$!: Observable<Product[]>;
  searchControl = new FormControl('');

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.products$ = combineLatest([
      this.inventoryService.products$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, term]) => {
        if (!term) return products;
        const q = term.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      })
    );
  }
}
