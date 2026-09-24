import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'app',
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'inventario',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/inventory/inventory.component').then(
                (m) => m.InventoryComponent,
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./features/inventory/components/product-creation/product-creation.component').then(
                (m) => m.ProductCreationComponent,
              ),
          },
        ],
      },
      {
        path: 'ventas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/sales/sales.component').then(
                (m) => m.SalesComponent,
              ),
          },
          {
            path: 'rapida',
            loadComponent: () =>
              import('./features/sales/components/quick-sale/quick-sale.component').then(
                (m) => m.QuickSaleComponent,
              ),
          },
          {
            path: 'detalle',
            loadComponent: () =>
              import('./features/sales/components/sale-details/sale-details.component').then(
                (m) => m.SaleDetailsComponent,
              ),
          },
          {
            path: 'comprobante',
            loadComponent: () =>
              import('./features/sales/components/sale-receipt/sale-receipt.component').then(
                (m) => m.SaleReceiptComponent,
              ),
          },
        ],
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clients/clients.component').then(
            (m) => m.ClientsComponent,
          ),
      },
      {
        path: 'pagos',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/payments/payments.component').then(
                (m) => m.PaymentsComponent,
              ),
          },
          {
            path: 'cuentas-por-cobrar',
            loadComponent: () =>
              import('./features/payments/components/accounts-receivable/accounts-receivable.component').then(
                (m) => m.AccountsReceivableComponent,
              ),
          },
          {
            path: 'registro',
            loadComponent: () =>
              import('./features/payments/components/register-payment/register-payment.component').then(
                (m) => m.RegisterPaymentComponent,
              ),
          },
          {
            path: 'liquidacion',
            loadComponent: () =>
              import('./features/payments/components/full-liquidation/full-liquidation.component').then(
                (m) => m.FullLiquidationComponent,
              ),
          },
        ],
      },
      {
        path: 'compras',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/purchases/purchases.component').then(
                (m) => m.PurchasesComponent,
              ),
          },
          {
            path: 'ingreso',
            loadComponent: () =>
              import('./features/purchases/components/purchase-entry/purchase-entry.component').then(
                (m) => m.PurchaseEntryComponent,
              ),
          },
          {
            path: 'lote',
            loadComponent: () =>
              import('./features/purchases/components/register-batch/register-batch.component').then(
                (m) => m.RegisterBatchComponent,
              ),
          },
        ],
      },
      {
        path: 'gastos',
        loadComponent: () =>
          import('./features/expenses/expenses.component').then(
            (m) => m.ExpensesComponent,
          ),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent,
          ),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
