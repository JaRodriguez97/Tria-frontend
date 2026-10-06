import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  SalesService,
  SaleItem,
} from '../../../../core/services/sales.service';
import {
  InventoryService,
  Product,
} from '../../../../core/services/inventory.service';
import {
  ClientsService,
  Client,
} from '../../../../core/services/clients.service';
import { PaymentsService } from '../../../../core/services/payments.service';
import { TopBarComponent } from '../../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-quick-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TopBarComponent],
  templateUrl: './quick-sale.component.html',
  styleUrl: './quick-sale.component.scss',
})
export class QuickSaleComponent implements OnInit, OnDestroy {
  saleItems: SaleItem[] = [];
  currentMode: 'full' | 'abono' | 'fiado' = 'abono';
  abonoInput: number = 50000;
  nextPaymentDate: string = '';

  // Búsqueda de productos en vivo
  productSearchQuery: string = '';
  searchResults: Product[] = [];
  selectedUniverse: 'all' | 'belleza' | 'moda' | 'lenceria' = 'all';

  // Gestión de clientes
  clients: Client[] = [];
  selectedClient: Client | null = null;
  isClientModalOpen: boolean = false;
  clientSearchQuery: string = '';
  isCreatingClient: boolean = false;
  newClientName: string = '';
  newClientPhone: string = '';

  // Estados de proceso
  isSaving = false;
  isSaved = false;
  timerSeconds = 0;
  private timerInterval: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private salesService: SalesService,
    private inventoryService: InventoryService,
    private clientsService: ClientsService,
    private paymentsService: PaymentsService,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
      }, 1000);
    }

    // Cargar clientes
    this.clients = this.clientsService.getClients();
    if (this.clients.length > 0) {
      this.selectedClient = this.clients[0]; // María Rodríguez por defecto
    }

    // Cargar ítems seleccionados desde el borrador de inventario
    const draft = this.salesService.getDraftItems();
    if (draft.length > 0) {
      this.saleItems = draft.map((i) => ({ ...i }));
    } else {
      // Verificar si viene con queryParam productId
      const paramId = this.route.snapshot.queryParams['productId'];
      if (paramId) {
        const prod = this.inventoryService.getProductById(paramId);
        if (prod) {
          this.saleItems = [
            { product: prod, quantity: 1, subtotal: prod.price },
          ];
          this.salesService.addToDraft(prod, 1);
        }
      }
    }

    // Si aún está vacío, precargar el primer producto disponible para previsualización inmediata
    if (this.saleItems.length === 0) {
      const allProds = this.inventoryService.getProducts();
      if (allProds.length > 0) {
        const defaultProd = allProds[0];
        this.saleItems = [
          { product: defaultProd, quantity: 1, subtotal: defaultProd.price },
        ];
        this.salesService.addToDraft(defaultProd, 1);
      }
    }

    // Configurar abono sugerido inicial
    this.recalculateAbonoDefault();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  get currentTotal(): number {
    return this.saleItems.reduce((acc, item) => acc + item.subtotal, 0);
  }

  get totalItemsCount(): number {
    return this.saleItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  get abono(): number {
    if (this.currentMode === 'full') return this.currentTotal;
    if (this.currentMode === 'fiado') return 0;

    let val = this.abonoInput || 0;
    if (val > this.currentTotal) val = this.currentTotal;
    if (val < 0) val = 0;
    return val;
  }

  get pending(): number {
    return Math.max(0, this.currentTotal - this.abono);
  }

  recalculateAbonoDefault() {
    if (this.currentMode === 'full') {
      this.abonoInput = this.currentTotal;
    } else if (this.currentMode === 'abono') {
      // Sugerir aprox 40-50% redondeado a 10.000
      const half = Math.round((this.currentTotal * 0.5) / 10000) * 10000;
      this.abonoInput = half > 0 ? half : this.currentTotal;
    } else {
      this.abonoInput = 0;
    }
  }

  setPaymentMode(mode: 'full' | 'abono' | 'fiado') {
    this.currentMode = mode;
    this.recalculateAbonoDefault();
  }

  setAbonoAmount(val: number) {
    this.abonoInput = Math.min(this.currentTotal, Math.max(0, val));
  }

  incItemQty(item: SaleItem) {
    if (item.quantity < item.product.stock) {
      item.quantity++;
      item.subtotal = item.quantity * item.product.price;
      this.salesService.updateDraftQty(item.product.id, item.quantity);
      if (this.currentMode === 'full') this.abonoInput = this.currentTotal;
    }
  }

  decItemQty(item: SaleItem, index: number) {
    if (item.quantity > 1) {
      item.quantity--;
      item.subtotal = item.quantity * item.product.price;
      this.salesService.updateDraftQty(item.product.id, item.quantity);
      if (this.currentMode === 'full') this.abonoInput = this.currentTotal;
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    const [removed] = this.saleItems.splice(index, 1);
    if (removed) {
      this.salesService.removeFromDraft(removed.product.id);
    }
    if (this.currentMode === 'full') this.abonoInput = this.currentTotal;
  }

  // Búsqueda de productos en caliente
  onSearchProduct(term: string) {
    this.productSearchQuery = term;
    if (!term || term.trim() === '') {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.inventoryService.search(term);
  }

  addProductToSale(product: Product) {
    if (product.stock <= 0) return;
    const existing = this.saleItems.find((i) => i.product.id === product.id);
    if (existing) {
      this.incItemQty(existing);
    } else {
      const newItem: SaleItem = {
        product,
        quantity: 1,
        subtotal: product.price,
      };
      this.saleItems.push(newItem);
      this.salesService.addToDraft(product, 1);
    }
    this.productSearchQuery = '';
    this.searchResults = [];
    if (this.currentMode === 'full') this.abonoInput = this.currentTotal;
  }

  // Clientes
  get filteredClients(): Client[] {
    if (!this.clientSearchQuery.trim()) return this.clients;
    const q = this.clientSearchQuery.toLowerCase();
    return this.clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }

  openClientModal() {
    this.isClientModalOpen = true;
    this.clientSearchQuery = '';
    this.isCreatingClient = false;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
  }

  selectClient(client: Client | null) {
    this.selectedClient = client;
    this.closeClientModal();
  }

  openCreateClient() {
    this.isCreatingClient = true;
    this.newClientName = '';
    this.newClientPhone = '';
  }

  cancelCreateClient() {
    this.isCreatingClient = false;
  }

  saveNewClient() {
    if (!this.newClientName.trim()) return;
    this.clientsService.addClient({
      name: this.newClientName,
      phone: this.newClientPhone,
      totalPurchases: 0,
      totalPaid: 0,
      balance: 0,
      status: 'active',
      lastPurchase: 'Nueva Clienta',
    }).subscribe((newClient) => {
      this.clients = this.clientsService.getClients();
      this.selectClient(newClient);
    });
  }

  confirmSale() {
    if (this.saleItems.length === 0) return;
    this.isSaving = true;

    // Descontar inventario real por cada prenda vendida
    this.saleItems.forEach((item) => {
      this.inventoryService.decrementStock(item.product.id, item.quantity);
    });

    const paymentMethodStr =
      this.currentMode === 'full'
        ? 'Efectivo (Total Pagado)'
        : this.currentMode === 'abono'
          ? 'Abono en Caja'
          : 'Fiado Total (Cartera)';

    const clientName = this.selectedClient
      ? this.selectedClient.name
      : 'Cliente Ocasional / Mostrador';
    const clientPhone = this.selectedClient ? this.selectedClient.phone : '';
    const clientId = this.selectedClient ? this.selectedClient.id : 'anon';

    // Registrar en SalesService
    this.salesService.addSale(this.saleItems, paymentMethodStr, {
      clientId,
      clientName,
      clientPhone,
      mode: this.currentMode,
      abono: this.abono,
      pendingBalance: this.pending,
      nextPaymentDate: this.nextPaymentDate,
    }).subscribe({
      next: (sale) => {
        // El backend registra la compra y crea la deuda en cartera automáticamente
        this.clientsService.refreshClients();
        this.paymentsService.refreshDebts();

        this.isSaved = true;
        setTimeout(() => {
          // Redirigir al comprobante con el saleId
          this.router.navigate(['/app/ventas/comprobante'], {
            queryParams: { saleId: sale.id },
          });
        }, 900);
      },
      error: () => {
        this.isSaving = false;
        alert('Error al registrar la venta en la base de datos.');
      }
    });
  }

  get formattedTimer(): string {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}s`;
  }
}
