import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId?: string;
  universe?: 'belleza' | 'moda' | 'lenceria';
  universeName?: string;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  status: 'active' | 'inactive';
}

export interface UniverseWithCategories {
  id: string;
  slug: string;
  name: string;
  categories: Array<{ id: string; name: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private universesSubject = new BehaviorSubject<UniverseWithCategories[]>([]);
  universes$ = this.universesSubject.asObservable();

  private categoriesCache: Array<{
    id: string;
    name: string;
    universeId: string;
  }> = [];

  // Banderas de control de caché y deduplicación en vuelo
  private productsLoaded = false;
  private isLoadingProducts = false;
  private categoriesLoaded = false;
  private isLoadingCategories = false;

  constructor() {
    this.refreshProducts();
    this.loadCategories();

    // Reaccionar ÚNICAMENTE cuando el estado de autenticación REALMENTE cambie (ej: usuario hace login o logout)
    let isFirstAuthEmission = true;
    this.auth.isAuthenticated$.pipe(distinctUntilChanged()).subscribe(() => {
      if (isFirstAuthEmission) {
        isFirstAuthEmission = false;
        return;
      }
      this.refreshProducts(true);
    });
  }

  loadCategories(force = false): void {
    if (!force && (this.categoriesLoaded || this.isLoadingCategories)) {
      return;
    }
    this.isLoadingCategories = true;

    this.api
      .get<{ data: UniverseWithCategories[] }>('/catalog/universes')
      .subscribe({
        next: (res) => {
          this.isLoadingCategories = false;
          this.categoriesLoaded = true;
          if (res?.data) {
            this.universesSubject.next(res.data);
            const list: Array<{
              id: string;
              name: string;
              universeId: string;
            }> = [];
            for (const u of res.data) {
              for (const cat of u.categories) {
                list.push({ id: cat.id, name: cat.name, universeId: u.id });
              }
            }
            this.categoriesCache = list;
          }
        },
        error: () => {
          this.isLoadingCategories = false;
        },
      });
  }

  getCategoriesByUniverse(universeSlug: string): string[] {
    const universes = this.universesSubject.value;
    const found = universes.find(
      (u) =>
        u.slug.toLowerCase() === universeSlug.toLowerCase() ||
        u.id === universeSlug,
    );
    if (found && found.categories.length > 0) {
      return found.categories.map((c) => c.name);
    }
    return [];
  }

  createCategory(
    name: string,
    universeSlug: string,
  ): Observable<{ id: string; name: string; universeId: string }> {
    return new Observable((subscriber) => {
      this.api
        .post<{
          data: {
            id: string;
            name: string;
            universeId: string;
            universeSlug: string;
          };
        }>('/catalog/categories', {
          name: name.trim(),
          universeId: universeSlug,
        })
        .subscribe({
          next: (res) => {
            if (res?.data) {
              const universes = [...this.universesSubject.value];
              const idx = universes.findIndex(
                (u) =>
                  u.slug.toLowerCase() === universeSlug.toLowerCase() ||
                  u.id === universeSlug,
              );
              if (idx !== -1) {
                universes[idx] = {
                  ...universes[idx],
                  categories: [
                    ...universes[idx].categories,
                    { id: res.data.id, name: res.data.name },
                  ],
                };
                this.universesSubject.next(universes);
              }
              this.loadCategories(true);
              subscriber.next(res.data);
              subscriber.complete();
            }
          },
          error: (err) => {
            subscriber.error(err);
          },
        });
    });
  }

  refreshProducts(force = false): void {
    if (!force && (this.productsLoaded || this.isLoadingProducts)) {
      return;
    }
    this.isLoadingProducts = true;

    const isAuth = this.auth.isAuthenticated();
    const endpoint = isAuth ? '/products' : '/catalog/products';

    this.api.get<{ data: Product[] }>(endpoint).subscribe({
      next: (res) => {
        this.isLoadingProducts = false;
        this.productsLoaded = true;
        if (res?.data) {
          const uploadsUrl = environment.apiUrl.replace(/\/api$/, '/uploads/');
          const formattedData = res.data.map((p) => ({
            ...p,
            image:
              p.image &&
              !p.image.startsWith('http') &&
              !p.image.startsWith('data:')
                ? uploadsUrl + p.image
                : p.image,
          }));
          this.productsSubject.next(formattedData);
        }
      },
      error: () => {
        this.isLoadingProducts = false;
      },
    });
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  getProductById(id: string): Product | undefined {
    return this.productsSubject.value.find((p) => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'> & { cost?: number }): void {
    const matchedCategory = this.categoriesCache.find(
      (c) => c.name.toLowerCase() === product.category.toLowerCase(),
    );

    if (matchedCategory) {
      this.api
        .post<{ data: Product }>('/products', {
          name: product.name,
          sku: product.sku,
          categoryId: matchedCategory.id,
          price: product.price,
          cost: product.cost ?? Math.round(product.price * 0.5),
          stock: product.stock,
          imageBase64: product.image,
        })
        .subscribe({
          next: (res) => {
            if (res?.data) {
              const currentProducts = this.productsSubject.value;
              this.productsSubject.next([...currentProducts, res.data]);
            }
          },
          error: (err) => {
            console.error('Error creando producto en BD:', err);
          },
        });
    }
  }

  decrementStock(productId: string, quantity: number): boolean {
    const products = this.productsSubject.value;
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return false;
    const current = products[index];
    const newStock = Math.max(0, current.stock - quantity);
    const updated = [...products];
    updated[index] = { ...current, stock: newStock };
    this.productsSubject.next(updated);
    return true;
  }

  search(query: string): Product[] {
    const term = query.toLowerCase().trim();
    if (!term) return this.productsSubject.value;
    return this.productsSubject.value.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }

  checkSkuExists(sku: string): boolean {
    return this.productsSubject.value.some(
      (p) => p.sku.toLowerCase() === sku.toLowerCase(),
    );
  }
}
