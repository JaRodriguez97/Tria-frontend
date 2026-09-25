import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MoodboardItem {
  id: string;
  image: string;
  alt: string;
  tag: string;
  offset: boolean;
}

@Component({
  selector: 'app-landing-moodboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-moodboard.component.html',
  styleUrl: './landing-moodboard.component.scss',
})
export class LandingMoodboardComponent {
  readonly moodboardItems: MoodboardItem[] = [
    {
      id: 'siluetas',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCQWq9EOFiNZitcDCVthx2LVDe8imBhRBaa8wdiYjWreFlv6kM42TmQ5_YtaZNmmGOQuZRfnGi339iz0lOpe2EeJ4_u4sc25d5xWMAzNRaY5Uz_nvy_aTr6sJcybhHlYni5CBETlsPxoJs3dpLhNl6mu7KghEvDfQMI_e5kPNchkWdiUyUQ1YThgi1YKl2q3o9hPcvXdXnWXEG18O_KPIy57yp68dJWfzg8qNvOUlOn1NAU3xbARl5-yA',
      alt: 'Vestido de seda fluido — siluetas de alta costura TRÍA Boutique Cali',
      tag: 'Siluetas de Alta Costura',
      offset: false,
    },
    {
      id: 'encaje',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3mWTKr3nvmkRnm6_B47JOQ9Z7j0M7XUwiW8yKwXyw5jRBtH3uqcUY25oKI1ENI_oSMYOPXIhPR54NYKkS2GmIgBXf2SAwdoryZ0_GfKLooWyZQPQZ4_VVQtkOdSmJb8Y4QRBoe6h7kJhUAqGFxUNopIkxlSQH9yAYcP8YFSFk91yS8-_mNJu3H3Cpew6FKJk1iBUgBIrJWrJfViPjkOtXVWboquAK5kmAfyw8J-MRU11tuTZrak1i5w',
      alt: 'Lencería fina y detalles de encaje artesanal — TRÍA Lingerie',
      tag: 'Intimidad & Encaje',
      offset: true,
    },
    {
      id: 'rituales',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKB_fGGjyWKfdPJK73udIuF9S3ly3LNqtY9ouhw6O1pT07eFtHiUmtrzTV4B4rHgfIUdZNzO-t9GPHlLxjOan4i5vMz7SG0h3iIwUWZNkzKPWqZBaPdQx_NK2w17xnDld4QL762kesSv4Nf8O5hrKoyZ4rhs6mNf1oPw6Q-63JJSVX4zjxtibHsuZf6HjFQYcsNNlSzjDKQXQwUJIEEPBzBDAoBJa5o1YqAqnV_HEbg8CpJTzNKW-suQ',
      alt: 'Fragancia de autor y rituales de belleza — TRÍA Beauty',
      tag: 'Rituales de Belleza',
      offset: false,
    },
    {
      id: 'alquimia',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XlbCRpyFJDVl9QQ_qmHCTEIADR3poz8IrY8M7HrkfMmqwa8bF9-QzGvnaokno6V8eZrfvZ3Rk9rx8Vx9uRoW8W4KbQr5mQ4tShY9vi21lO6fheqE90wTM2noVuPsMiOrSBXuhZkaDA9IKB3wKOiXuhKFDxAJ17F_wYkg6NyD_nrXafMjbCvGUEt1me3tFrTT8z_3yVu7kc30Fc5g5JTIBlKhiVilt5cYVtfkD05-YX5dcTweDLHqi23EfG',
      alt: 'Sérums y alquimia botánica para el cuidado facial — TRÍA',
      tag: 'Alquimia Botánica',
      offset: true,
    },
    {
      id: 'cuidado',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAR43ITa_JfjBdQlc238SpfDk9Iqo7Pz2r21xEY_EQ1Rf9ha5dW5iYEs3gZJSjR0RAfrseBpiAxhfiuM4nNygJNRi1u0Z7a4GQi9bQW1hmBflA-4DZRILcHOm9GVPdadgXi1JhZcym2n-OCRW4ET26fC7kliPuEildHXv5bgfGMHaFtIKS_OguxcRP1AZzMhPw6-qerkqLoGkwpdDJtDhOb3PJMAVXOL8fEzNVCpRWeuw_tgBOkBjj65Q',
      alt: 'Bálsamo botánico y rodillo de jade para cuidado consciente — TRÍA',
      tag: 'Cuidado Consciente',
      offset: false,
    },
    {
      id: 'maison',
      image:
        'https://lh3.googleusercontent.com/aida/AEtjO1XsV3x2tDLxeQ1Rf9sl3ritR8n9Y3257ARjiedzlzRC9Y42QCBdp2r6tVnpkd3giJBxuM2rd68_pfMJfA16c3tAtIxkPgYR8ZhDoSjynwjtzjLSXZG_uAWgXhyL6wNw5EmSRyfCNwiwYAjLZ0o4RHM0LBgjfNDIFcb7FsnhE8xUqZPbt3kqT2EN9wQltSJQQovypzfEReyMQO26ejdPe7NiBsU-C7miiYCtdKA6kw3gzltJm0ZjrPds51rK',
      alt: 'Curaduría de moda contemporánea y alta costura — TRÍA Boutique Cali',
      tag: 'Boutique de Autor',
      offset: true,
    },
  ];
}
