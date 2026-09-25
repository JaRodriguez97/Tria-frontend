import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BentoBadge {
  text: string;
  class: string;
}

export interface BentoItem {
  id: string;
  type: 'hero' | 'editorial' | 'compact' | 'banner';
  colSpan: string;
  heightClass: string;
  paddingClass: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  gradientClass: string;
  badges: BentoBadge[];
  title: string;
  description?: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  ctaIcon?: string;
}

@Component({
  selector: 'app-landing-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-collections.component.html',
})
export class LandingCollectionsComponent {
  readonly bentoItems: BentoItem[] = [
    {
      id: 'fashion-ateliers',
      type: 'hero',
      colSpan: 'md:col-span-8',
      heightClass: 'min-h-[350px] sm:min-h-[380px] lg:min-h-[420px]',
      paddingClass: 'p-space-lg lg:p-space-xl',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XsV3x2tDLxeQ1Rf9sl3ritR8n9Y3257ARjiedzlzRC9Y42QCBdp2r6tVnpkd3giJBxuM2rd68_pfMJfA16c3tAtIxkPgYR8ZhDoSjynwjtzjLSXZG_uAWgXhyL6wNw5EmSRyfCNwiwYAjLZ0o4RHM0LBgjfNDIFcb7FsnhE8xUqZPbt3kqT2EN9wQltSJQQovypzfEReyMQO26ejdPe7NiBsU-C7miiYCtdKA6kw3gzltJm0ZjrPds51rK',
      alt: 'Colección de moda femenina y alta sastrería contemporánea — TRÍA Boutique Cali',
      width: 800,
      height: 420,
      gradientClass:
        'bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent',
      badges: [
        {
          text: 'Colección Principal',
          class:
            'bg-surface/20 backdrop-blur-md border border-outline-variant/40 text-primary-fixed uppercase font-semibold',
        },
      ],
      title: 'Moda & Alta Sastrería',
      description:
        'Sastrería contemporánea, abrigos envolventes y vestidos fluidos concebidos con acabados artesanales de alta costura.',
      ctaText: 'Descubrir selección',
      ctaHref: '#seleccion',
      ctaIcon: 'north_east',
    },
    {
      id: 'siluetas-vestidos',
      type: 'editorial',
      colSpan: 'md:col-span-4',
      heightClass: 'min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]',
      paddingClass: 'p-space-lg',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCQWq9EOFiNZitcDCVthx2LVDe8imBhRBaa8wdiYjWreFlv6kM42TmQ5_YtaZNmmGOQuZRfnGi339iz0lOpe2EeJ4_u4sc25d5xWMAzNRaY5Uz_nvy_aTr6sJcybhHlYni5CBETlsPxoJs3dpLhNl6mu7KghEvDfQMI_e5kPNchkWdiUyUQ1YThgi1YKl2q3o9hPcvXdXnWXEG18O_KPIy57yp68dJWfzg8qNvOUlOn1NAU3xbARl5-yA',
      alt: 'Siluetas y vestidos fluidos en satén noble — TRÍA Boutique',
      width: 400,
      height: 420,
      gradientClass:
        'bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent',
      badges: [
        {
          text: 'Edición Exclusiva',
          class:
            'bg-surface/20 backdrop-blur-md text-secondary-fixed uppercase font-medium',
        },
      ],
      title: 'Siluetas & Vestidos',
      description:
        'Patronaje fluido de espalda descubierta y caída en satén noble.',
      ctaText: 'Ver vestidos',
      ctaHref: '#seleccion',
      ctaIcon: 'arrow_forward',
    },
    {
      id: 'lingerie-fine',
      type: 'compact',
      colSpan: 'md:col-span-4',
      heightClass: 'min-h-[260px] sm:min-h-[280px] lg:min-h-[300px]',
      paddingClass: 'p-space-lg',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3mWTKr3nvmkRnm6_B47JOQ9Z7j0M7XUwiW8yKwXyw5jRBtH3uqcUY25oKI1ENI_oSMYOPXIhPR54NYKkS2GmIgBXf2SAwdoryZ0_GfKLooWyZQPQZ4_VVQtkOdSmJb8Y4QRBoe6h7kJhUAqGFxUNopIkxlSQH9yAYcP8YFSFk91yS8-_mNJu3H3Cpew6FKJk1iBUgBIrJWrJfViPjkOtXVWboquAK5kmAfyw8J-MRU11tuTZrak1i5w',
      alt: 'Lencería fina — bralettes y batas de seda con encaje artesanal TRÍA Boutique',
      width: 400,
      height: 300,
      gradientClass:
        'bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent',
      badges: [
        {
          text: 'Seda & Encajes',
          class:
            'bg-surface-container-lowest/80 backdrop-blur-md text-primary font-medium',
        },
      ],
      title: 'Lencería Fina',
      subtitle: 'Bralettes y batas de seda',
      ctaText: 'Explorar',
      ctaHref: '#seleccion',
    },
    {
      id: 'rituales-belleza',
      type: 'compact',
      colSpan: 'md:col-span-4',
      heightClass: 'min-h-[260px] sm:min-h-[280px] lg:min-h-[300px]',
      paddingClass: 'p-space-lg',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKB_fGGjyWKfdPJK73udIuF9S3ly3LNqtY9ouhw6O1pT07eFtHiUmtrzTV4B4rHgfIUdZNzO-t9GPHlLxjOan4i5vMz7SG0h3iIwUWZNkzKPWqZBaPdQx_NK2w17xnDld4QL762kesSv4Nf8O5hrKoyZ4rhs6mNf1oPw6Q-63JJSVX4zjxtibHsuZf6HjFQYcsNNlSzjDKQXQwUJIEEPBzBDAoBJa5o1YqAqnV_HEbg8CpJTzNKW-suQ',
      alt: 'Rituales de belleza, perfumes de autor y labiales TRÍA Beauty',
      width: 400,
      height: 300,
      gradientClass:
        'bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent',
      badges: [
        {
          text: 'Perfumería & Color',
          class:
            'bg-surface-container-lowest/80 backdrop-blur-md text-primary font-medium',
        },
      ],
      title: 'Rituales de Belleza',
      subtitle: 'Aromas de autor & labiales',
      ctaText: 'Ver belleza',
      ctaHref: '#seleccion',
    },
    {
      id: 'cuidado-botanico',
      type: 'compact',
      colSpan: 'md:col-span-4',
      heightClass: 'min-h-[260px] sm:min-h-[280px] lg:min-h-[300px]',
      paddingClass: 'p-space-lg',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XlbCRpyFJDVl9QQ_qmHCTEIADR3poz8IrY8M7HrkfMmqwa8bF9-QzGvnaokno6V8eZrfvZ3Rk9rx8Vx9uRoW8W4KbQr5mQ4tShY9vi21lO6fheqE90wTM2noVuPsMiOrSBXuhZkaDA9IKB3wKOiXuhKFDxAJ17F_wYkg6NyD_nrXafMjbCvGUEt1me3tFrTT8z_3yVu7kc30Fc5g5JTIBlKhiVilt5cYVtfkD05-YX5dcTweDLHqi23EfG',
      alt: 'Cuidado botánico facial, elixires y aceites esenciales TRÍA Beauty',
      width: 400,
      height: 300,
      gradientClass:
        'bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent',
      badges: [
        {
          text: 'Próximamente',
          class:
            'bg-secondary-container/90 backdrop-blur-md text-on-secondary-container font-semibold',
        },
        {
          text: 'Elixires',
          class:
            'bg-surface-container-lowest/80 backdrop-blur-md text-primary font-medium',
        },
      ],
      title: 'Cuidado Botánico',
      subtitle: 'Sérums y aceites esenciales',
      ctaText: 'Conocer',
      ctaHref: '#seleccion',
    },
    {
      id: 'balsamos-jade',
      type: 'banner',
      colSpan: 'md:col-span-12',
      heightClass: 'min-h-[240px] sm:min-h-[200px] lg:min-h-[240px]',
      paddingClass: 'p-space-lg',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAR43ITa_JfjBdQlc238SpfDk9Iqo7Pz2r21xEY_EQ1Rf9ha5dW5iYEs3gZJSjR0RAfrseBpiAxhfiuM4nNygJNRi1u0Z7a4GQi9bQW1hmBflA-4DZRILcHOm9GVPdadgXi1JhZcym2n-OCRW4ET26fC7kliPuEildHXv5bgfGMHaFtIKS_OguxcRP1AZzMhPw6-qerkqLoGkwpdDJtDhOb3PJMAVXOL8fEzNVCpRWeuw_tgBOkBjj65Q',
      alt: 'Tratamiento botánico regenerativo con bálsamos y rodillo de jade facial TRÍA',
      width: 1200,
      height: 240,
      gradientClass:
        'bg-gradient-to-r from-inverse-surface/90 via-inverse-surface/60 to-transparent',
      badges: [
        {
          text: 'Ritual Sensorial',
          class:
            'bg-surface/20 backdrop-blur-md text-primary-fixed uppercase font-semibold',
        },
      ],
      title: 'Bálsamos & Jade Facial',
      description:
        'Tratamientos botánicos regenerativos para integrar el bienestar consciente a tu rutina diaria.',
      ctaText: 'Explorar rituales',
      ctaHref: '#seleccion',
    },
  ];
}
