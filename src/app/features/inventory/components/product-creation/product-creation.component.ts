import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../../../core/services/inventory.service';

@Component({
  selector: 'app-product-creation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss'],
})
export class ProductCreationComponent {
  name = '';
  currentStock = 1;
  cost: number | null = null;
  price: number | null = null;
  sku = '';
  imagePreview: string | null = null;
  description = '';
  isSaving = false;
  isSaved = false;
  selectedUniverse = 'moda';
  selectedSubcategory = 'Vestidos';

  showNewCategoryInput = false;
  newCategoryName = '';
  isCreatingCategory = false;

  get creationId(): string {
    const count = this.inventoryService.getProducts().length + 1;
    return count.toString().padStart(3, '0');
  }

  get subcategories(): string[] {
    return this.inventoryService.getCategoriesByUniverse(this.selectedUniverse);
  }

  saveNewCategory() {
    const trimmed = this.newCategoryName.trim();
    if (!trimmed) return;
    this.isCreatingCategory = true;
    this.inventoryService.createCategory(trimmed, this.selectedUniverse).subscribe({
      next: (cat) => {
        this.selectedSubcategory = cat.name;
        this.newCategoryName = '';
        this.showNewCategoryInput = false;
        this.isCreatingCategory = false;
        this.regenerateSKU();
      },
      error: () => {
        this.isCreatingCategory = false;
      },
    });
  }

  constructor(
    private location: Location,
    private inventoryService: InventoryService,
  ) {}

  goBack() {
    this.location.back();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  modifyStock(delta: number) {
    this.currentStock = Math.max(0, this.currentStock + delta);
  }

  get isValid(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.sku.trim().length > 0 &&
      this.price !== null &&
      this.price > 0 &&
      this.cost !== null &&
      this.cost >= 0 &&
      !this.inventoryService.checkSkuExists(this.sku)
    );
  }

  get isSkuDuplicate(): boolean {
    return (
      this.sku.trim().length > 0 &&
      this.inventoryService.checkSkuExists(this.sku)
    );
  }

  get unitGain() {
    return (this.price || 0) - (this.cost || 0);
  }

  get margin() {
    return (this.price || 0) > 0
      ? ((this.unitGain / (this.price || 1)) * 100).toFixed(1)
      : '0.0';
  }

  get multiplier() {
    return (this.cost || 0) > 0
      ? ((this.price || 0) / (this.cost || 1)).toFixed(1)
      : '0.0';
  }

  get totalCost() {
    return (this.cost || 0) * this.currentStock;
  }

  get totalSales() {
    return (this.price || 0) * this.currentStock;
  }

  get totalGain() {
    return this.unitGain * this.currentStock;
  }

  setUniverse(universe: string) {
    this.selectedUniverse = universe;
    // Seleccionar automáticamente la primera subcategoría del nuevo universo
    this.selectedSubcategory = this.subcategories[0];
    this.regenerateSKU();
  }

  setSubcategory(subcat: string) {
    this.selectedSubcategory = subcat;
    this.regenerateSKU();
  }

  regenerateSKU() {
    const prefix = this.selectedSubcategory
      ? this.selectedSubcategory.substring(0, 3).toUpperCase()
      : 'TRA';

    const num = Math.floor(100 + Math.random() * 900);
    this.sku = '#' + prefix + '-' + num;
  }

  submitProduct() {
    if (!this.isValid) return;

    this.isSaving = true;

    const newProduct = {
      name: this.name,
      sku: this.sku,
      category: this.selectedSubcategory,
      universe: this.selectedUniverse as 'belleza' | 'moda' | 'lenceria',
      price: this.price || 0,
      stock: this.currentStock,
      image: this.imagePreview || undefined,
      status: (this.currentStock > 0 ? 'active' : 'inactive') as
        | 'active'
        | 'inactive',
    };

    setTimeout(() => {
      this.inventoryService.addProduct(newProduct);
      this.isSaving = false;
      this.isSaved = true;
      setTimeout(() => this.goBack(), 700);
    }, 900);
  }
}
