import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/services/inventory.service';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-modal.component.html',
})
export class ProductDetailModalComponent {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Input() showPrivateMetrics = false;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() addToSale = new EventEmitter<Product>();
  @Output() togglePrivateMode = new EventEmitter<void>();

  isImageZoomOpen = false;

  toggleImageZoom(): void {
    this.isImageZoomOpen = !this.isImageZoomOpen;
  }

  onClose(): void {
    this.isImageZoomOpen = false;
    this.close.emit();
  }

  onEdit(): void {
    if (this.product) {
      this.edit.emit(this.product);
    }
  }

  onDelete(): void {
    if (this.product) {
      this.delete.emit(this.product);
    }
  }

  onAddToSale(): void {
    if (this.product && this.product.stock > 0) {
      this.addToSale.emit(this.product);
      this.onClose();
    }
  }
}
