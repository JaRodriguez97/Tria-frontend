import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss'],
})
export class ProductCreationComponent {
  currentStock = 12;
  cost = 38000;
  price = 80000;
  sku = '#VES-090';
  isSaving = false;
  isSaved = false;
  selectedUniverse = 'fashion';
  selectedSubcategory = 'Vestidos';

  subcategories = ['Vestidos', 'Bodys', 'Tops', 'Blusas', 'Conjuntos'];

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  modifyStock(delta: number) {
    this.currentStock = Math.max(1, this.currentStock + delta);
  }

  get unitGain() {
    return this.price - this.cost;
  }

  get margin() {
    return this.price > 0 ? ((this.unitGain / this.price) * 100).toFixed(1) : 0;
  }

  get multiplier() {
    return this.cost > 0 ? (this.price / this.cost).toFixed(1) : '0.0';
  }

  get totalCost() {
    return this.cost * this.currentStock;
  }

  get totalSales() {
    return this.price * this.currentStock;
  }

  get totalGain() {
    return this.unitGain * this.currentStock;
  }

  setUniverse(universe: string) {
    this.selectedUniverse = universe;
  }

  setSubcategory(subcat: string) {
    this.selectedSubcategory = subcat;
  }

  regenerateSKU() {
    const prefixes = ['VES', 'BOD', 'COR', 'LNC', 'TOP'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    this.sku = '#' + prefix + '-' + num;
  }

  submitProduct() {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.isSaved = true;
      setTimeout(() => this.goBack(), 700);
    }, 900);
  }
}
