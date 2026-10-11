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
  description?: string;
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
          const formattedData = res.data.map((p) => ({
            ...p,
            sku: p.sku ? p.sku.replace(/^#+/, '') : '',
            image: this.formatImageUrl(p.image),
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

  addProduct(
    product: Omit<Product, 'id'> & { cost?: number },
  ): Observable<{ data: Product }> {
    const matchedCategory = this.categoriesCache.find(
      (c) => c.name.toLowerCase() === product.category.toLowerCase(),
    );

    if (!matchedCategory) {
      return new Observable((sub) =>
        sub.error(new Error('Categoría no encontrada')),
      );
    }

    const cleanSku = product.sku.trim().replace(/^#+/, '').toUpperCase();

    return new Observable((subscriber) => {
      this.api
        .post<{ data: Product }>('/products', {
          name: product.name,
          sku: cleanSku,
          categoryId: matchedCategory.id,
          price: product.price,
          cost: product.cost ?? Math.round(product.price * 0.5),
          stock: product.stock,
          imageBase64: product.image,
        })
        .subscribe({
          next: (res) => {
            if (res?.data) {
              const newProduct = {
                ...res.data,
                sku: res.data.sku ? res.data.sku.replace(/^#+/, '') : cleanSku,
                image: this.formatImageUrl(res.data.image),
              };
              const currentProducts = this.productsSubject.value;
              this.productsSubject.next([newProduct, ...currentProducts]);
              subscriber.next(res);
              subscriber.complete();
            }
          },
          error: (err) => {
            console.error('Error creando producto en BD:', err);
            subscriber.error(err);
          },
        });
    });
  }

  updateProduct(
    id: string,
    updates: {
      name?: string;
      sku?: string;
      category?: string;
      categoryId?: string;
      price?: number;
      cost?: number;
      stock?: number;
      description?: string;
      image?: string;
      imageBase64?: string;
    },
  ): Observable<Product> {
    let categoryId = updates.categoryId;
    if (!categoryId && updates.category) {
      const matched = this.categoriesCache.find(
        (c) => c.name.toLowerCase() === updates.category!.toLowerCase(),
      );
      if (matched) categoryId = matched.id;
    }

    const cleanSku = updates.sku
      ? updates.sku.trim().replace(/^#+/, '').toUpperCase()
      : undefined;

    return new Observable((subscriber) => {
      this.api
        .put<{ data: Product }>(`/products/${id}`, {
          name: updates.name,
          sku: cleanSku,
          categoryId,
          price: updates.price,
          cost: updates.cost,
          stock: updates.stock,
          description: updates.description,
          imageUrl:
            updates.image && !updates.image.startsWith('data:')
              ? updates.image
              : undefined,
          imageBase64:
            updates.imageBase64 ||
            (updates.image?.startsWith('data:') ? updates.image : undefined),
        })
        .subscribe({
          next: (res) => {
            if (res?.data) {
              const updatedProduct = {
                ...res.data,
                sku: res.data.sku
                  ? res.data.sku.replace(/^#+/, '')
                  : cleanSku || '',
                image: this.formatImageUrl(res.data.image),
              };
              const products = this.productsSubject.value.map((p) =>
                p.id === id ? updatedProduct : p,
              );
              this.productsSubject.next(products);
              subscriber.next(updatedProduct);
              subscriber.complete();
            }
          },
          error: (err) => {
            console.error('Error actualizando producto:', err);
            subscriber.error(err);
          },
        });
    });
  }

  deleteProduct(id: string): Observable<{ success: boolean }> {
    return new Observable((subscriber) => {
      this.api
        .delete<{ data: { success: boolean; id: string } }>(`/products/${id}`)
        .subscribe({
          next: () => {
            // Eliminar reactivamente de la lista activa
            const products = this.productsSubject.value.filter(
              (p) => p.id !== id,
            );
            this.productsSubject.next(products);
            subscriber.next({ success: true });
            subscriber.complete();
          },
          error: (err) => {
            console.error('Error eliminando producto:', err);
            subscriber.error(err);
          },
        });
    });
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
    const termClean = term.replace(/^#+/, '');
    return this.productsSubject.value.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.sku &&
          (p.sku.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(termClean))) ||
        p.category.toLowerCase().includes(term),
    );
  }

  checkSkuExists(sku: string): boolean {
    const clean = sku.trim().replace(/^#+/, '').toLowerCase();
    if (!clean) return false;
    return this.productsSubject.value.some(
      (p) => (p.sku || '').toLowerCase().replace(/^#+/, '') === clean,
    );
  }

  private formatImageUrl(imagePath?: string): string | undefined {
    if (!imagePath) return imagePath;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:'))
      return imagePath;

    // Si estamos en localhost, forzamos la ruta al backend explícitamente sin depender del entorno
    if (
      typeof window !== 'undefined' &&
      window.location.origin.includes('localhost:4200')
    ) {
      return 'http://localhost:3003' + imagePath;
    }
    // Normalizar la ruta asegurando que inicie con slash
    const normalizedPath = imagePath.startsWith('/')
      ? imagePath
      : `/${imagePath}`;

    // Obtener la URL base del backend desde environment.apiUrl (removiendo el prefijo /api)
    const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${baseUrl}${normalizedPath}`;
  }
}
