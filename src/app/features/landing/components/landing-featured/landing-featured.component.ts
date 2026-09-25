import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class LandingFeaturedComponent {
  readonly products: FeaturedProduct[] = [
    {
      id: 'vestido-aura',
      colSpan: 'lg:col-span-5',
      aspectClass: 'aspect-[4/5]',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1VxDnbmzTYraFsBXCs-j9RLSS-rUSROpV3Ir7xvWUs4mwAjhjF2PzNgE3L32HvhmDIySOB-5VcbmfemmfYyDB3dRzduQ128xmMBcP8x4-jJxoRWUziGBTDXJHgiEV8dzQ5Oa0wKBRksEUNv_yovZuxl2SrdldKjWIH4cg2Bkkxk4IRMsfKa8FXX_X0Ir99ZAsjenkmznD0lBfJNuVuGCmZO2Id6b2xR8dBQOi2YaOVjuxc4bdqpQxpt2OA',
      alt: 'Vestido Aura Fluido — satén con drapeado sutil, moda femenina TRÍA Cali',
      width: 480,
      height: 600,
      badges: [
        {
          text: 'Moda Femenina',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
        {
          text: 'Cápsula Seda N° 01',
          class: 'bg-surface/30 backdrop-blur-md text-white font-light',
        },
      ],
      bottomBadge: 'Disponibilidad Limitada',
      category: 'Cápsula Seda',
      title: 'Vestido ‘Aura’ Fluido',
      description:
        'Caída etérea en satén con drapeado sutil de hombros y escote drapeado.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20la%20disponibilidad%20del%20Vestido%20Aura',
      ctaText: 'Consultar disponibilidad',
      ctaIcon: 'chat',
    },
    {
      id: 'rose-privee',
      colSpan: 'lg:col-span-4',
      aspectClass: 'aspect-[4/5]',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1U70K1X33JouOd--Wmqrz2k0rnR41FdadB9O3zsqbippMgfNNuVtn5kC4r7WvqcI9Kr6x2SdMWx1UaXdBuLWJKHi_yoZfLY9ksc06zI7WjJrP1iq7wsHQPf1IFrLKJ7VYMJy806WC07OqdXyOk9wZj4f91Fk8qt2OGzYtBn4-6PuMmCqMJkUeWCA3zVys3uO8zxNAap3RxPr-JH8-hWONKxGoOa0_psNEcI2uZW3J05tBgAP-av1jpsZseQ',
      alt: 'Perfume Rose Privée — fragancia con rosas de mayo y cedro blanco, TRÍA Beauty',
      width: 400,
      height: 500,
      badges: [
        {
          text: 'Ritual de Belleza',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
        {
          text: 'Edición Parfum',
          class: 'bg-surface/30 backdrop-blur-md text-white font-light',
        },
      ],
      category: 'Perfume Privé 100ml',
      title: 'Rose Privée Essence',
      description: 'Notas de rosa de mayo, pimienta rosa y cedro blanco.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20la%20disponibilidad%20de%20Rose%20Priv%C3%A9e',
      ctaText: 'Consultar disponibilidad',
      ctaIcon: 'chat',
    },
    {
      id: 'conjunto-etheree',
      colSpan: 'lg:col-span-3',
      aspectClass: 'aspect-[4/5]',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XDTFNVQfAf947IL9yO7hwlcYIAB-D1EnOWucbkQGDv_pohc2XMFm0jhsf55fPqlKot7HoHpisidFiWjX0WwLV4R1ieHimgpMWRYgfbF2i_C4CCjsAtnKVsI7ZX6v0qCQlT23PH4vak55yISTT4lkAhgDac5HEoVAuDI9uD8LmoaP7cuXvdY80duPpk7uRiQzh6D2ztUzx2JdPvwq99uHu79ZX7BzDjlKDfXctEWuBtv8H9WyQC05qLjNox',
      alt: 'Conjunto Éthérée — lencería fina en encaje floral y satén de seda, TRÍA Lingerie',
      width: 300,
      height: 375,
      badges: [
        {
          text: 'Lencería Fina',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Encaje de Calais',
      title: 'Conjunto ‘Éthérée’',
      description: 'Encaje floral ultradelicado sin aros y satén de seda.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20el%20Conjunto%20%C3%89th%C3%A9r%C3%A9e',
      ctaText: 'Consultar',
      ctaIcon: 'chat',
    },
    {
      id: 'trench-atelier',
      colSpan: 'lg:col-span-3',
      aspectClass: 'aspect-square',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XsV3x2tDLxeQ1Rf9sl3ritR8n9Y3257ARjiedzlzRC9Y42QCBdp2r6tVnpkd3giJBxuM2rd68_pfMJfA16c3tAtIxkPgYR8ZhDoSjynwjtzjLSXZG_uAWgXhyL6wNw5EmSRyfCNwiwYAjLZ0o4RHM0LBgjfNDIFcb7FsnhE8xUqZPbt3kqT2EN9wQltSJQQovypzfEReyMQO26ejdPe7NiBsU-C7miiYCtdKA6kw3gzltJm0ZjrPds51rK',
      alt: 'Trench Coat Atelier Paris — sastrería fluida camel de alta costura, TRÍA Boutique',
      width: 300,
      height: 300,
      badges: [
        {
          text: 'Moda Femenina',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Sastrería',
      title: 'Trench ‘Atelier Paris’',
      description: 'Sastrería fluida en tono camel con lazada a la cintura.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20el%20Trench%20Atelier%20Paris',
      ctaText: 'Consultar',
      ctaIcon: 'chat',
    },
    {
      id: 'elixir-lor-rose',
      colSpan: 'lg:col-span-3',
      aspectClass: 'aspect-square',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XlbCRpyFJDVl9QQ_qmHCTEIADR3poz8IrY8M7HrkfMmqwa8bF9-QzGvnaokno6V8eZrfvZ3Rk9rx8Vx9uRoW8W4KbQr5mQ4tShY9vi21lO6fheqE90wTM2noVuPsMiOrSBXuhZkaDA9IKB3wKOiXuhKFDxAJ17F_wYkg6NyD_nrXafMjbCvGUEt1me3tFrTT8z_3yVu7kc30Fc5g5JTIBlKhiVilt5cYVtfkD05-YX5dcTweDLHqi23EfG',
      alt: "Elixir facial L'Or Rose — aceite nutritivo con escualano y vitamina C, TRÍA Beauty",
      width: 300,
      height: 300,
      badges: [
        {
          text: 'Ritual de Belleza',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Sérum Facial',
      title: 'Elixir ‘L’Or Rose’',
      description: 'Aceite facial nutritivo con escualano y vitamina C.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20el%20Elixir%20L%27Or%20Rose',
      ctaText: 'Consultar',
      ctaIcon: 'chat',
    },
    {
      id: 'kit-balsamo-jade',
      colSpan: 'lg:col-span-3',
      aspectClass: 'aspect-square',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1U4ctMFNixeCu76gPzEAk_CcNaHpYROF26Zq2sCYw3vr-9asjGESmsxNZZ-Hu0GB0hqttERGhxoiRI9qPUTADuCUlrXSgodlif0s7mAQhppaCJZk69K2oAybWl5w8xIah7DpPreOqVcT9Fm05QNwvQdqaDsY8lNZ_3VL7M2iTt8yTH8n8TzsEXoggbJtzc_4ue5YPtUwkPT0_eTT4L0jdEDvkzTN4rQ932og-XtdzlTFHZn4NuFaUddfdq5',
      alt: 'Kit Botánico y rodillo de jade — bálsamo limpiador melt-and-nourish, TRÍA',
      width: 300,
      height: 300,
      badges: [
        {
          text: 'Ritual',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
        {
          text: 'Próximamente',
          class:
            'bg-secondary-container/90 backdrop-blur-md text-on-secondary-container font-medium',
        },
      ],
      category: 'Bienestar & Cuidado',
      title: 'Kit Bálsamo & Jade',
      description: 'Bálsamo limpiador melt-and-nourish y cuarzo natural.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20unirme%20a%20la%20lista%20VIP%20del%20Kit%20Bot%C3%A1nico',
      ctaText: 'Lista VIP',
      ctaIcon: 'bookmark',
    },
    {
      id: 'rouge-rose-gold',
      colSpan: 'lg:col-span-3',
      aspectClass: 'aspect-square',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1U70K1X33JouOd--Wmqrz2k0rnR41FdadB9O3zsqbippMgfNNuVtn5kC4r7WvqcI9Kr6x2SdMWx1UaXdBuLWJKHi_yoZfLY9ksc06zI7WjJrP1iq7wsHQPf1IFrLKJ7VYMJy806WC07OqdXyOk9wZj4f91Fk8qt2OGzYtBn4-6PuMmCqMJkUeWCA3zVys3uO8zxNAap3RxPr-JH8-hWONKxGoOa0_psNEcI2uZW3J05tBgAP-av1jpsZseQ',
      alt: 'Labial Rouge Rose Gold — labial cremoso con manteca de karité, TRÍA Beauty',
      width: 300,
      height: 300,
      badges: [
        {
          text: 'Belleza',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Color & Labios',
      title: 'Rouge Rose Gold',
      description: 'Labial cremoso acabado satinado con manteca de karité.',
      waQuery: 'Hola%20TR%C3%8DA,%20deseo%20consultar%20el%20Rouge%20Nude',
      ctaText: 'Consultar',
      ctaIcon: 'chat',
    },
    {
      id: 'kimono-slip-soie',
      colSpan: 'lg:col-span-6',
      isHorizontal: true,
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XDTFNVQfAf947IL9yO7hwlcYIAB-D1EnOWucbkQGDv_pohc2XMFm0jhsf55fPqlKot7HoHpisidFiWjX0WwLV4R1ieHimgpMWRYgfbF2i_C4CCjsAtnKVsI7ZX6v0qCQlT23PH4vak55yISTT4lkAhgDac5HEoVAuDI9uD8LmoaP7cuXvdY80duPpk7uRiQzh6D2ztUzx2JdPvwq99uHu79ZX7BzDjlKDfXctEWuBtv8H9WyQC05qLjNox',
      alt: 'Kimono y slip Soie — satén de seda marfil con encaje artesanal, TRÍA Lingerie',
      width: 400,
      height: 400,
      badges: [
        {
          text: 'Lencería Fina',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Pieza Íntima',
      subCategoryTag: 'Seda',
      title: 'Kimono & Slip ‘Soie’',
      description: 'Satén de seda marfil y ribetes de encaje artesanal.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20la%20disponibilidad%20del%20Kimono%20y%20Slip%20Soie',
      ctaText: 'Consultar disponibilidad',
      ctaIcon: 'chat',
    },
    {
      id: 'body-sculpt-dos-nu',
      colSpan: 'lg:col-span-6',
      isHorizontal: true,
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1VxDnbmzTYraFsBXCs-j9RLSS-rUSROpV3Ir7xvWUs4mwAjhjF2PzNgE3L32HvhmDIySOB-5VcbmfemmfYyDB3dRzduQ128xmMBcP8x4-jJxoRWUziGBTDXJHgiEV8dzQ5Oa0wKBRksEUNv_yovZuxl2SrdldKjWIH4cg2Bkkxk4IRMsfKa8FXX_X0Ir99ZAsjenkmznD0lBfJNuVuGCmZO2Id6b2xR8dBQOi2YaOVjuxc4bdqpQxpt2OA',
      alt: 'Body Sculpt Dos Nu — silueta moldeadora con cuello halter, TRÍA Fashion',
      width: 400,
      height: 400,
      badges: [
        {
          text: 'Alta Costura',
          class:
            'bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold',
        },
      ],
      category: 'Edición Limitada',
      subCategoryTag: 'Atelier',
      title: 'Body ‘Sculpt’ Dos Nu',
      description: 'Silueta moldeadora de soporte invisible con cuello halter.',
      waQuery:
        'Hola%20TR%C3%8DA,%20deseo%20consultar%20el%20Body%20Sculpt%20Dos%20Nu',
      ctaText: 'Consultar disponibilidad',
      ctaIcon: 'chat',
    },
  ];
}
