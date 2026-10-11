import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import {
  InventoryService,
  Product,
} from '../../core/services/inventory.service';
import { SalesService, SaleItem } from '../../core/services/sales.service';
import {
  Observable,
  combineLatest,
  startWith,
  map,
  BehaviorSubject,
  shareReplay,
} from 'rxjs';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { ProductDetailModalComponent } from './components/product-detail-modal/product-detail-modal.component';
import { ProductEditModalComponent } from './components/product-edit-modal/product-edit-modal.component';
import { ProductDeleteModalComponent } from './components/product-delete-modal/product-delete-modal.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    BottomNavComponent,
    TopBarComponent,
    ProductDetailModalComponent,
    ProductEditModalComponent,
    ProductDeleteModalComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  products$!: Observable<Product[]>;
  universes$!: Observable<any[]>;
  searchControl = new FormControl('');
  selectedUniverseSubject = new BehaviorSubject<string>('all');
  selectedUniverse$ = this.selectedUniverseSubject.asObservable();

  selectedStockFilterSubject = new BehaviorSubject<
    'all' | 'available' | 'low' | 'out'
  >('all');
  selectedStockFilter$ = this.selectedStockFilterSubject.asObservable();

  totalRefs$!: Observable<number>;
  totalUnits$!: Observable<number>;
  countAll$!: Observable<number>;
  countAvailable$!: Observable<number>;
  countLow$!: Observable<number>;
  countOut$!: Observable<number>;

  totalCost$!: Observable<number>;
  totalRetailValue$!: Observable<number>;
  totalProfit$!: Observable<number>;

  // Borrador de venta rápida
  draftItems$!: Observable<SaleItem[]>;
  draftCount$!: Observable<number>;
  draftTotal$!: Observable<number>;

  uniqueCategories$!: Observable<string[]>;

  constructor(
    private inventoryService: InventoryService,
    private salesService: SalesService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isPrivateMode =
        localStorage.getItem('tria_inventory_private_mode') === 'true';
    }

    this.universes$ = this.inventoryService.universes$;

    this.uniqueCategories$ = this.inventoryService.products$.pipe(
      map((products) => {
        const cats = new Set(products.map((p) => p.category));
        return Array.from(cats).sort();
      }),
    );

    this.totalRefs$ = this.inventoryService.products$.pipe(
      map((p) => p.length),
    );
    this.totalUnits$ = this.inventoryService.products$.pipe(
      map((p) => p.reduce((acc, curr) => acc + curr.stock, 0)),
    );
    this.countAll$ = this.totalRefs$;
    this.countAvailable$ = this.inventoryService.products$.pipe(
      map((p) => p.filter((x) => x.stock > 3).length),
    );
    this.countLow$ = this.inventoryService.products$.pipe(
      map((p) => p.filter((x) => x.stock > 0 && x.stock <= 3).length),
    );
    this.countOut$ = this.inventoryService.products$.pipe(
      map((p) => p.filter((x) => x.stock === 0).length),
    );

    // Valorización de inventario
    const valuationStats$ = this.inventoryService.products$.pipe(
      map((products) => {
        let cost = 0;
        let retail = 0;
        for (let i = 0; i < products.length; i++) {
          const p = products[i];
          const itemCost = p.cost !== undefined ? p.cost : p.price * 0.5; // estimate 50% margin if cost not set
          cost += itemCost * p.stock;
          retail += p.price * p.stock;
        }
        return { cost, retail, profit: retail - cost };
      }),
      shareReplay(1),
    );

    this.totalCost$ = valuationStats$.pipe(map((s) => s.cost));
    this.totalRetailValue$ = valuationStats$.pipe(map((s) => s.retail));
    this.totalProfit$ = valuationStats$.pipe(map((s) => s.profit));

    this.draftItems$ = this.salesService.draftItems$;
    const draftStats$ = this.draftItems$.pipe(
      map((items) => {
        let count = 0;
        let total = 0;
        // 1 sola iteración más rápida que 2 reduce separados
        for (let i = 0; i < items.length; i++) {
          count += items[i].quantity;
          total += items[i].subtotal;
        }
        return { count, total };
      }),
      shareReplay(1),
    );

    this.draftCount$ = draftStats$.pipe(map((stats) => stats.count));
    this.draftTotal$ = draftStats$.pipe(map((stats) => stats.total));

    this.products$ = combineLatest([
      this.inventoryService.products$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.selectedUniverse$,
      this.selectedStockFilter$,
    ]).pipe(
      map(([products, term, universe, stockFilter]) => {
        let result = products;

        if (stockFilter === 'available') {
          result = result.filter((p) => p.stock > 3);
        } else if (stockFilter === 'low') {
          result = result.filter((p) => p.stock > 0 && p.stock <= 3);
        } else if (stockFilter === 'out') {
          result = result.filter((p) => p.stock === 0);
        }

        if (universe !== 'all') {
          result = result.filter(
            (p) =>
              p.universe === universe ||
              p.category.toLowerCase().includes(universe),
          );
        }
        if (term) {
          const q = term.toLowerCase().trim();
          const qClean = q.replace(/^#+/, '');
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(qClean) ||
              p.category.toLowerCase().includes(q),
          );
        }
        return result;
      }),
    );
  }

  setStockFilter(filter: 'all' | 'available' | 'low' | 'out') {
    this.selectedStockFilterSubject.next(filter);
  }

  setUniverse(universe: string) {
    this.selectedUniverseSubject.next(universe);
  }

  toggleUniverse(universe: string) {
    const current = this.selectedUniverseSubject.value;
    this.selectedUniverseSubject.next(current === universe ? 'all' : universe);
  }

  getItemQtyInDraft(productId: string): number {
    const item = this.salesService.getDraftItem(productId);
    return item ? item.quantity : 0;
  }

  addProductToDraft(product: Product) {
    if (product.stock <= 0) return;
    this.salesService.addToDraft(product, 1);
  }

  incrementDraft(product: Product) {
    const currentQty = this.getItemQtyInDraft(product.id);
    if (currentQty < product.stock) {
      this.salesService.updateDraftQty(product.id, currentQty + 1);
    }
  }

  decrementDraft(productId: string) {
    const currentQty = this.getItemQtyInDraft(productId);
    if (currentQty > 0) {
      this.salesService.updateDraftQty(productId, currentQty - 1);
    }
  }

  goToQuickSale() {
    this.router.navigate(['/app/ventas/rapida']);
  }

  // Modo Discreto / Modo Vitrina (Ocultar costos y márgenes ante clientas)
  isPrivateMode = false;

  togglePrivateMode() {
    this.isPrivateMode = !this.isPrivateMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'tria_inventory_private_mode',
        String(this.isPrivateMode),
      );
    }
    this.showToast(
      this.isPrivateMode
        ? 'Modo Atelier: Costos y utilidades visibles para administración'
        : 'Modo Vitrina: Costos y márgenes protegidos ante clientas',
    );
  }

  // Estado de los Modales
  selectedProduct: Product | null = null;
  isDetailOpen = false;
  isEditModalOpen = false;
  isDeleteConfirmOpen = false;

  // Notificaciones Toast
  toastVisible = false;
  toastMessage = '';

  openProductDetail(product: Product) {
    this.selectedProduct = product;
    this.isDetailOpen = true;
  }

  closeProductDetail() {
    this.isDetailOpen = false;
    this.selectedProduct = null;
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.isDetailOpen = false;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  onProductSaved(updated: Product) {
    this.selectedProduct = updated;
    this.closeEditModal();
    this.showToast('¡Pieza actualizada con éxito en el catálogo!');
  }

  openDeleteConfirm(product: Product) {
    this.selectedProduct = product;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm() {
    this.isDeleteConfirmOpen = false;
  }

  onProductDeleted(deleted: Product) {
    this.closeDeleteConfirm();
    this.closeProductDetail();
    this.showToast('Pieza retirada del catálogo con éxito (baja segura)');
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3200);
  }
}
