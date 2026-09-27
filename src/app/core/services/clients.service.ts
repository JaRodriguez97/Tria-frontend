import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ClientPurchase {
  id: string;
  date: string;
  description: string;
  total: number;
  paid: number;
  balance: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  initials?: string;
  totalPurchases: number;
  totalPaid: number;
  balance: number;
  status: 'active' | 'debt' | 'settled' | 'vip';
  purchasesCount: number;
  lastPurchase: string;
  dueInDays?: number;
  history: ClientPurchase[];
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private initialClients: Client[] = [
    {
      id: 'CLI-001',
      name: 'María Rodríguez',
      phone: '+57 300 123 4567',
      // avatar:
        // 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPlb2PJKiyOL8p5MjWTReUU7GIWWnDc7DS37WJwn62HFzIQY0-wrGtfZ65RMKxbIS-AF6MkeWjqm0wxp7nTqtqLnMAmKD-q8H5EQDaJ2oqMF1zCcKEc7LCSgDVQ0dSSRmARnOPj-y4UESvSO935HBONHvX_BLBZ_twNIkwIT7ibtGg2WNeBK37CbA6LgT2noBFuSAFWBVfDvwmUG45UhDyypRK5NqCYDEPUv_QJRSeqYFpqGhWcj_F',
      totalPurchases: 350000,
      totalPaid: 280000,
      balance: 70000,
      status: 'debt',
      purchasesCount: 4,
      lastPurchase: 'Vestido Seda & Perfume',
      dueInDays: 3,
      history: [
        {
          id: 'VNT-0012',
          date: '09 Sep 2026',
          description: 'Vestido Seda & Perfume',
          total: 120000,
          paid: 50000,
          balance: 70000,
        },
        {
          id: 'VNT-0005',
          date: '15 Ago 2026',
          description: 'Conjunto Lencería Encaje Negro',
          total: 120000,
          paid: 120000,
          balance: 0,
        },
        {
          id: 'VNT-0002',
          date: '10 Jul 2026',
          description: 'Bralette Encaje & Tanga Clásica',
          total: 110000,
          paid: 110000,
          balance: 0,
        },
      ],
    },
    {
      id: 'CLI-002',
      name: 'Valentina Gómez',
      phone: '+57 312 987 6543',
      // avatar:
        // 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK8lE_xXo6K8qF1U7Y8nC7xJ4R7_gD8_uE_xXo6K8qF1U7Y8nC7xJ4R7_gD8_uE_xXo6K8qF1U7Y8nC7xJ4R7_gD8_uE_xXo6K8qF1U7Y8nC7xJ4R7_gD8_u',
      initials: 'VG',
      totalPurchases: 220000,
      totalPaid: 180000,
      balance: 40000,
      status: 'debt',
      purchasesCount: 3,
      lastPurchase: 'Bralette Seda Blanco & Panty',
      dueInDays: 7,
      history: [
        {
          id: 'VNT-0015',
          date: '12 Sep 2026',
          description: 'Bralette Seda Blanco & Panty',
          total: 130000,
          paid: 90000,
          balance: 40000,
        },
        {
          id: 'VNT-0007',
          date: '28 Ago 2026',
          description: 'Top Satín & Panty Invisible',
          total: 90000,
          paid: 90000,
          balance: 0,
        },
      ],
    },
    {
      id: 'CLI-003',
      name: 'Camila Torres',
      phone: '+57 320 456 7890',
      initials: 'CT',
      totalPurchases: 185000,
      totalPaid: 160000,
      balance: 25000,
      status: 'debt',
      purchasesCount: 2,
      lastPurchase: 'Body Encaje Floral',
      dueInDays: 5,
      history: [
        {
          id: 'VNT-0018',
          date: '18 Sep 2026',
          description: 'Body Encaje Floral',
          total: 150000,
          paid: 125000,
          balance: 25000,
        },
        {
          id: 'VNT-0009',
          date: '25 Ago 2026',
          description: 'Liguero Seda Rose Gold',
          total: 35000,
          paid: 35000,
          balance: 0,
        },
      ],
    },
    {
      id: 'CLI-004',
      name: 'Sofía Vergara',
      phone: '+57 301 555 1234',
      initials: 'SV',
      totalPurchases: 950000,
      totalPaid: 930000,
      balance: 20000,
      status: 'vip',
      purchasesCount: 4,
      lastPurchase: 'Colección Seda Edición Limitada',
      dueInDays: 12,
      history: [
        {
          id: 'VNT-0021',
          date: '20 Sep 2026',
          description: 'Colección Seda Edición Limitada',
          total: 350000,
          paid: 330000,
          balance: 20000,
        },
        {
          id: 'VNT-0016',
          date: '05 Sep 2026',
          description: 'Conjunto Rouge Noir Atelier',
          total: 240000,
          paid: 240000,
          balance: 0,
        },
        {
          id: 'VNT-0011',
          date: '18 Ago 2026',
          description: 'Bralette Couture Velvet & Robe',
          total: 210000,
          paid: 210000,
          balance: 0,
        },
        {
          id: 'VNT-0004',
          date: '22 Jul 2026',
          description: 'Body Ilusión & Kimono Satín',
          total: 150000,
          paid: 150000,
          balance: 0,
        },
      ],
    },
    {
      id: 'CLI-005',
      name: 'Isabella Restrepo',
      phone: '+57 310 888 9900',
      initials: 'IR',
      totalPurchases: 180000,
      totalPaid: 180000,
      balance: 0,
      status: 'settled',
      purchasesCount: 3,
      lastPurchase: 'Pijama Satín Dos Piezas',
      history: [
        {
          id: 'VNT-0008',
          date: '02 Sep 2026',
          description: 'Pijama Satín Dos Piezas',
          total: 180000,
          paid: 180000,
          balance: 0,
        },
      ],
    },
  ];

  private clientsSubject = new BehaviorSubject<Client[]>(this.initialClients);
  clients$: Observable<Client[]> = this.clientsSubject.asObservable();

  constructor() {}

  getClients(): Client[] {
    return this.clientsSubject.value;
  }

  getClientById(id: string): Client | undefined {
    return this.clientsSubject.value.find((c) => c.id === id);
  }

  addClient(
    newClientData: Omit<Client, 'id' | 'purchasesCount' | 'history'>,
  ): Client {
    const clients = this.clientsSubject.value;
    const client: Client = {
      ...newClientData,
      id: `CLI-${String(clients.length + 1).padStart(3, '0')}`,
      purchasesCount: 0,
      history: [],
      initials:
        newClientData.initials ||
        newClientData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase(),
    };
    this.clientsSubject.next([client, ...clients]);
    return client;
  }

  registerAbono(clientId: string, amount: number): boolean {
    const clients = this.clientsSubject.value;
    const index = clients.findIndex((c) => c.id === clientId);
    if (index === -1) return false;

    const client = { ...clients[index] };
    client.balance = Math.max(0, client.balance - amount);
    client.totalPaid += amount;
    if (client.balance === 0 && client.status === 'debt') {
      client.status = 'settled';
    }

    const updated = [...clients];
    updated[index] = client;
    this.clientsSubject.next(updated);
    return true;
  }

  getTotalDebt(): number {
    return this.clientsSubject.value.reduce((acc, c) => acc + c.balance, 0);
  }

  getDebtCount(): number {
    return this.clientsSubject.value.filter((c) => c.balance > 0).length;
  }
}
