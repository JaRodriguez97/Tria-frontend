import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { LandingNavbarComponent } from './components/landing-navbar/landing-navbar.component';
import { LandingHeroComponent } from './components/landing-hero/landing-hero.component';
import { LandingIdentityComponent } from './components/landing-identity/landing-identity.component';
import { LandingCollectionsComponent } from './components/landing-collections/landing-collections.component';
import { LandingFeaturedComponent } from './components/landing-featured/landing-featured.component';
import { LandingBenefitsComponent } from './components/landing-benefits/landing-benefits.component';
import { LandingMoodboardComponent } from './components/landing-moodboard/landing-moodboard.component';
import { LandingContactComponent } from './components/landing-contact/landing-contact.component';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    LandingNavbarComponent,
    LandingHeroComponent,
    LandingIdentityComponent,
    LandingCollectionsComponent,
    LandingFeaturedComponent,
    LandingBenefitsComponent,
    LandingMoodboardComponent,
    LandingContactComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'TRÍA Boutique | Moda Femenina, Lencería Fina y Belleza — Cali, Colombia',
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Boutique femenina en Cali con curaduría de moda contemporánea, lencería fina de autor y rituales de belleza botánica. Atención personalizada por WhatsApp y envíos a todo Colombia.',
    });
  }
}
