import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InventoryService,
  Product,
} from '../../../../core/services/inventory.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProductBadge {
  text: string;
  class: string;
}

export interface FeaturedProduct {
  id: string;
  colSpan: string;
  aspectClass?: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  badges: ProductBadge[];
  bottomBadge?: string;
  category: string;
  subCategoryTag?: string;
  title: string;
  sku: string;
  stock: number;
  price?: number;
  description: string;
  waQuery: string;
  ctaText: string;
  ctaIcon: string;
  isHorizontal?: boolean;
}

@Component({
  selector: 'app-landing-featured',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-featured.component.html',
})
export class LandingFeaturedComponent implements OnInit {
  products$!: Observable<FeaturedProduct[]>;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.products$ = this.inventoryService.products$.pipe(
      map((products) => {
        const bentoLayouts = [
          // Fila 1: 3 cards principales perfectamente equilibradas (4 + 4 + 4 = 12 columnas)
          {
            colSpan: 'lg:col-span-4',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          {
            colSpan: 'lg:col-span-4',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          {
            colSpan: 'lg:col-span-4',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          // Fila 2: 4 cards secundarias (3 + 3 + 3 + 3 = 12 columnas)
          {
            colSpan: 'lg:col-span-3',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          {
            colSpan: 'lg:col-span-3',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          {
            colSpan: 'lg:col-span-3',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          {
            colSpan: 'lg:col-span-3',
            aspectClass: 'aspect-[3/4]',
            isHorizontal: false,
          },
          // Fila 3: 2 cards panorámicas horizontales (6 + 6 = 12 columnas)
          { colSpan: 'lg:col-span-6', aspectClass: '', isHorizontal: true },
          { colSpan: 'lg:col-span-6', aspectClass: '', isHorizontal: true },
        ];

        return products.slice(0, 9).map((prod, index) => {
          const layout = bentoLayouts[index] || bentoLayouts[0];
          const cleanSku = prod.sku ? prod.sku.replace(/^#+/, '') : '';
          return {
            id: prod.id,
            colSpan: layout.colSpan,
            aspectClass: layout.aspectClass,
            isHorizontal: layout.isHorizontal,
            image: prod.image || '',
            alt: `Producto ${prod.name} - TRÍA Boutique`,
            width: 400,
            height: layout.isHorizontal ? 400 : 500,
            badges: [
              {
                text: prod.universe || 'Catálogo',
                class:
                  'bg-white/95 backdrop-blur-md text-primary font-semibold border border-white/40',
              },
            ],
            category: prod.category,
            title: prod.name,
            sku: cleanSku,
            stock: prod.stock,
            price: prod.price,
            description: `Ref: #${cleanSku} · ${prod.stock > 0 ? 'Stock Disponible' : 'Agotado'}`,
            waQuery: encodeURIComponent(
              `Hola TRÍA, deseo consultar la disponibilidad del producto ${prod.name} (Ref: #${cleanSku})`,
            ),
            ctaText: 'Consultar',
            ctaIcon: 'chat',
          };
        });
      }),
    );
  }
}
