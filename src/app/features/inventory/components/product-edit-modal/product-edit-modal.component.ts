import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InventoryService,
  Product,
} from '../../../../core/services/inventory.service';

@Component({
  selector: 'app-product-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit-modal.component.html',
})
export class ProductEditModalComponent implements OnChanges {
  private inventoryService = inject(InventoryService);

  @Input() product: Product | null = null;
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Product>();

  editName = '';
  editSku = '';
  editUniverse: 'belleza' | 'moda' | 'lenceria' = 'moda';
  editCategory = '';
  editPrice: number | null = null;
  editCost: number | null = null;
  editStock = 0;
  editDescription = '';
  editImagePreview = '';

  isSaving = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue && this.product) {
      this.initForm(this.product);
    } else if (changes['product']?.currentValue && this.isOpen) {
      this.initForm(changes['product'].currentValue);
    }
  }

  private initForm(prod: Product): void {
    this.editName = prod.name;
    this.editSku = prod.sku ? prod.sku.replace(/^#+/, '') : '';
    this.editUniverse = prod.universe || 'moda';
    this.editCategory = prod.category;
    this.editPrice = prod.price;
    this.editCost =
      prod.cost !== undefined ? prod.cost : Math.round(prod.price * 0.5);
    this.editStock = prod.stock;
    this.editDescription = prod.description || '';
    this.editImagePreview = prod.image || '';
    this.isSaving = false;
    this.errorMessage = '';
  }

  get editSubcategories(): string[] {
    return this.inventoryService.getCategoriesByUniverse(this.editUniverse);
  }

  setEditUniverse(universe: string): void {
    this.editUniverse = universe as 'belleza' | 'moda' | 'lenceria';
    const cats = this.editSubcategories;
    if (cats.length > 0) {
      if (!this.editCategory || !cats.includes(this.editCategory)) {
        this.editCategory = cats[0];
      }
    } else {
      this.editCategory = '';
    }
  }

  setEditCategory(cat: string): void {
    this.editCategory = cat;
  }

  onEditFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  modifyEditStock(delta: number): void {
    this.editStock = Math.max(0, (this.editStock || 0) + delta);
  }

  onClose(): void {
    if (this.isSaving) return;
    this.close.emit();
  }

  saveProductEdit(): void {
    if (
      !this.product ||
      !this.editName.trim() ||
      !this.editSku.trim() ||
      this.isSaving
    ) {
      return;
    }

    const cleanSku = this.editSku.trim().replace(/^#+/, '').toUpperCase();

    this.isSaving = true;
    this.errorMessage = '';

    this.inventoryService
      .updateProduct(this.product.id, {
        name: this.editName.trim(),
        sku: cleanSku,
        category: this.editCategory,
        price: Number(this.editPrice) || 0,
        cost: Number(this.editCost) || 0,
        stock: Number(this.editStock) || 0,
        description: this.editDescription.trim(),
        image: this.editImagePreview || undefined,
        imageBase64: this.editImagePreview?.startsWith('data:')
          ? this.editImagePreview
          : undefined,
      })
      .subscribe({
        next: (updated) => {
          this.isSaving = false;
          this.saved.emit(updated);
          this.close.emit();
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error al actualizar pieza:', err);
          this.errorMessage =
            err?.error?.error?.message ||
            'Hubo un error al actualizar la pieza. Intenta de nuevo.';
        },
      });
  }
}
