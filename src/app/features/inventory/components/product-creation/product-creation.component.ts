import { Component, OnInit } from '@angular/core';
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
export class ProductCreationComponent implements OnInit {
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

  userHasManuallyEditedSku = false;

  showNewCategoryInput = false;
  newCategoryName = '';
  isCreatingCategory = false;

  constructor(
    private location: Location,
    private inventoryService: InventoryService,
  ) {}

  ngOnInit(): void {
    this.inventoryService.loadCategories();
    this.inventoryService.refreshProducts();

    // Sincronizar subcategoría con las categorías disponibles del backend
    this.inventoryService.universes$.subscribe((universes) => {
      if (universes && universes.length > 0) {
        const available = this.subcategories;
        if (available.length > 0) {
          if (
            !this.selectedSubcategory ||
            !available.includes(this.selectedSubcategory)
          ) {
            this.selectedSubcategory = available[0];
          }
        }
        if (!this.sku || !this.userHasManuallyEditedSku) {
          this.generateConsecutiveSKU();
        }
      }
    });

    this.generateConsecutiveSKU();
  }

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
    this.inventoryService
      .createCategory(trimmed, this.selectedUniverse)
      .subscribe({
        next: (cat) => {
          this.selectedSubcategory = cat.name;
          this.newCategoryName = '';
          this.showNewCategoryInput = false;
          this.isCreatingCategory = false;
          this.generateConsecutiveSKU(true);
        },
        error: () => {
          this.isCreatingCategory = false;
        },
      });
  }

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

  onSkuManualChange() {
    this.userHasManuallyEditedSku = true;
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
    const available = this.subcategories;
    if (available.length > 0) {
      this.selectedSubcategory = available[0];
    } else {
      this.selectedSubcategory = '';
    }
    this.generateConsecutiveSKU();
  }

  setSubcategory(subcat: string) {
    this.selectedSubcategory = subcat;
    this.generateConsecutiveSKU();
  }

  private getCategoryPrefix(categoryName: string): string {
    if (!categoryName || !categoryName.trim()) {
      return 'TRA';
    }
    const normalized = categoryName
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');

    return normalized.substring(0, 3).toUpperCase() || 'TRA';
  }

  regenerateSKU() {
    this.generateConsecutiveSKU(true);
  }

  generateConsecutiveSKU(force = false) {
    // Si el usuario ya editó manualmente el SKU y no forzó la regeneración, respetar su valor
    if (this.userHasManuallyEditedSku && !force) {
      return;
    }

    const prefix = this.getCategoryPrefix(this.selectedSubcategory);
    const existingProducts = this.inventoryService.getProducts();

    // Buscar el consecutivo más alto existente para este prefijo (ej: #VES-001, #VES-2, VES-003)
    const prefixRegex = new RegExp(`^#?${prefix}-?(\\d+)$`, 'i');
    let maxNum = 0;

    for (const p of existingProducts) {
      if (!p.sku) continue;
      const cleanSku = p.sku.trim();
      const match = cleanSku.match(prefixRegex);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    }

    let nextNum = maxNum + 1;
    let candidate = `${prefix}-${String(nextNum).padStart(3, '0')}`;

    // Asegurar unicidad total en caso de SKUs atípicos
    while (this.inventoryService.checkSkuExists(candidate)) {
      nextNum++;
      candidate = `${prefix}-${String(nextNum).padStart(3, '0')}`;
    }

    this.sku = candidate;
    if (force) {
      this.userHasManuallyEditedSku = false;
    }
  }

  submitProduct() {
    if (!this.isValid) return;

    this.isSaving = true;

    const newProduct = {
      name: this.name,
      sku: this.sku.trim().replace(/^#+/, '').toUpperCase(),
      category: this.selectedSubcategory,
      universe: this.selectedUniverse as 'belleza' | 'moda' | 'lenceria',
      price: this.price || 0,
      cost: this.cost || 0,
      stock: this.currentStock,
      image: this.imagePreview || undefined,
      status: (this.currentStock > 0 ? 'active' : 'inactive') as
        | 'active'
        | 'inactive',
    };

    this.inventoryService.addProduct(newProduct).subscribe({
      next: () => {
        this.isSaving = false;
        this.isSaved = true;
        setTimeout(() => this.goBack(), 700);
      },
      error: () => {
        this.isSaving = false;
        alert('Hubo un error al crear el producto. Intenta de nuevo.');
      },
    });
  }
}
