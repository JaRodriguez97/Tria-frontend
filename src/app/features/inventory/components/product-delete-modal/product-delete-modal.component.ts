import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  InventoryService,
  Product,
} from '../../../../core/services/inventory.service';

@Component({
  selector: 'app-product-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-delete-modal.component.html',
})
export class ProductDeleteModalComponent {
  private inventoryService = inject(InventoryService);

  @Input() product: Product | null = null;
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<Product>();

  isDeleting = false;
  errorMessage = '';

  onClose(): void {
    if (this.isDeleting) return;
    this.errorMessage = '';
    this.close.emit();
  }

  confirmDelete(): void {
    if (!this.product || this.isDeleting) return;

    this.isDeleting = true;
    this.errorMessage = '';

    const productToDelete = this.product;

    this.inventoryService.deleteProduct(productToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.confirmed.emit(productToDelete);
        this.onClose();
      },
      error: (err) => {
        this.isDeleting = false;
        console.error('Error al retirar pieza del catálogo:', err);
        this.errorMessage =
          err?.error?.error?.message ||
          'Hubo un error al retirar la pieza del catálogo.';
      },
    });
  }
}
