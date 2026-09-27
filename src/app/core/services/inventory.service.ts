import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private productsSubject = new BehaviorSubject<Product[]>([
    {
      id: '1',
      name: 'Conjunto Lencería Encaje Negro',
      sku: 'LNC-001',
      category: 'Conjuntos',
      price: 120000,
      stock: 15,
      status: 'active',
    },
    {
      id: '2',
      name: 'Bralette Seda Blanco',
      sku: 'BRL-002',
      category: 'Bralettes',
      price: 85000,
      stock: 8,
      status: 'active',
    },
    {
      id: '3',
      name: 'Panty Tiro Alto Clásico',
      sku: 'PNT-003',
      category: 'Panties',
      price: 45000,
      stock: 24,
      status: 'active',
    },
    {
      id: '4',
      name: 'Body Encaje Floral',
      sku: 'BDY-004',
      category: 'Bodys',
      price: 150000,
      stock: 5,
      status: 'active',
    },
    {
      id: '5',
      name: 'Pijama Satín Dos Piezas',
      sku: 'PJM-005',
      category: 'Pijamas',
      price: 180000,
      stock: 12,
      status: 'active',
    },
  ]);

  products$ = this.productsSubject.asObservable();

  constructor() {}

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const currentProducts = this.productsSubject.value;
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.productsSubject.next([...currentProducts, newProduct]);
  }

  search(query: string): Product[] {
    const term = query.toLowerCase();
    return this.productsSubject.value.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term),
    );
  }

  checkSkuExists(sku: string): boolean {
    return this.productsSubject.value.some(p => p.sku.toLowerCase() === sku.toLowerCase());
  }
}
