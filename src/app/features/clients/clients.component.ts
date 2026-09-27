import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { ClientsService, Client } from '../../core/services/clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, TopBarComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: 'all' | 'debt' | 'settled' | 'vip' = 'all';

  // Floating badge on scroll
  showFloatingBadge: boolean = false;

  // Modal states
  selectedClientForHistory: Client | null = null;
  showNewClientModal: boolean = false;

  // New client form
  newClientName: string = '';
  newClientPhone: string = '';
  newClientInitialDebt: number = 0;
  newClientNote: string = '';

  constructor(public clientsService: ClientsService) {}

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const threshold = window.innerHeight / 2;
      this.showFloatingBadge = scrollPosition > threshold;
    }
  }

  get clients(): Client[] {
    return this.clientsService.getClients();
  }

  get filteredClients(): Client[] {
    let list = this.clients;

    if (this.selectedFilter === 'debt') {
      list = list.filter((c) => c.balance > 0);
    } else if (this.selectedFilter === 'settled') {
      list = list.filter((c) => c.balance === 0);
    } else if (this.selectedFilter === 'vip') {
      list = list.filter((c) => c.status === 'vip');
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.lastPurchase.toLowerCase().includes(q),
      );
    }

    return list;
  }

  get totalDebt(): number {
    return this.clientsService.getTotalDebt();
  }

  get debtClientsCount(): number {
    return this.clientsService.getDebtCount();
  }

  setFilter(filter: 'all' | 'debt' | 'settled' | 'vip'): void {
    this.selectedFilter = filter;
  }

  getWhatsAppUrl(client: Client): string {
    const cleanPhone = client.phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('57')
      ? cleanPhone
      : `57${cleanPhone}`;
    const name = client.name.split(' ')[0];

    let message = '';
    if (client.balance > 0) {
      message = `Hola ${name} 😊 Te escribimos de TRÍA Boutique para recordarte cordialmente que tienes un saldo pendiente de $${client.balance.toLocaleString('es-CO')} de tu compra en el atelier. ¡Coordinamos cuando gustes! ✨`;
    } else {
      message = `Hola ${name} ✨ ¡Esperamos que estés disfrutando tus prendas de TRÍA Boutique! Nos encantaría tenerte pronto de vuelta en el atelier. 💕`;
    }

    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
  }

  openHistory(client: Client): void {
    this.selectedClientForHistory = client;
  }

  closeHistory(): void {
    this.selectedClientForHistory = null;
  }

  openNewClientModal(): void {
    this.newClientName = '';
    this.newClientPhone = '';
    this.newClientInitialDebt = 0;
    this.newClientNote = '';
    this.showNewClientModal = true;
  }

  closeNewClientModal(): void {
    this.showNewClientModal = false;
  }

  saveNewClient(): void {
    if (!this.newClientName.trim() || !this.newClientPhone.trim()) {
      alert('Por favor ingresa nombre y teléfono de la clienta');
      return;
    }

    const debt = Number(this.newClientInitialDebt) || 0;
    this.clientsService.addClient({
      name: this.newClientName.trim(),
      phone: this.newClientPhone.trim(),
      totalPurchases: debt,
      totalPaid: 0,
      balance: debt,
      status: debt > 0 ? 'debt' : 'settled',
      lastPurchase: this.newClientNote.trim() || 'Apertura de ficha',
    });

    this.closeNewClientModal();
  }
}
