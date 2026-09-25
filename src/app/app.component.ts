import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Tria-frontend';

  private router = inject(Router);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event: NavigationEnd) => {
        // Si la ruta no es la raíz (Landing Page), aplicamos el tema oscuro del Back-Office (Atelier)
        // Aseguramos que los enlaces con anclas hacia la landing (ej. /#colecciones) también mantengan el tema claro.
        const isLanding =
          event.urlAfterRedirects === '/' ||
          event.urlAfterRedirects.startsWith('/#');

        if (!isLanding) {
          this.renderer.addClass(this.document.documentElement, 'theme-admin');
        } else {
          this.renderer.removeClass(
            this.document.documentElement,
            'theme-admin',
          );
        }
      });
  }
}
