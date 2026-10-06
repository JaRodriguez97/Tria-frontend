import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  nextPaymentDate?: string;
  history?: ClientPurchase[];
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private api = inject(ApiService);
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$: Observable<Client[]> = this.clientsSubject.asObservable();

  constructor() {
    this.refreshClients();
  }

  refreshClients(): void {
    this.api.get<{ data: Client[] }>('/clients').subscribe({
      next: (res) => {
        if (res?.data && res.data.length > 0) {
          this.clientsSubject.next(res.data);
        }
      },
      error: () => {},
    });
  }

  getClients(): Client[] {
    return this.clientsSubject.value;
  }

  getClientById(id: string): Client | undefined {
    return this.clientsSubject.value.find((c) => c.id === id);
  }

  addClient(
    newClientData: Omit<Client, 'id' | 'purchasesCount' | 'history'>,
  ): Observable<Client> {
    const clients = this.clientsSubject.value;

    return new Observable<Client>((subscriber) => {
      this.api.post<{ data: Client }>('/clients', {
        name: newClientData.name,
        phone: newClientData.phone,
      }).subscribe({
        next: (res) => {
          if (res?.data) {
            const client = res.data;
            this.clientsSubject.next([client, ...clients]);
            subscriber.next(client);
            subscriber.complete();
          }
        },
        error: (err) => {
          console.error('Error creando cliente:', err);
          subscriber.error(err);
        },
      });
    });
  }

  getTotalDebt(): number {
    return this.clientsSubject.value.reduce((acc, c) => acc + c.balance, 0);
  }

  getDebtCount(): number {
    return this.clientsSubject.value.filter((c) => c.balance > 0).length;
  }
}
