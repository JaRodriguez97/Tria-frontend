import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import {
  SettingsService,
  BoutiqueSettings,
} from '../../core/services/settings.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent, TopBarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  isEditingTemplate: boolean = false;
  currentTemplate: string = '';

  isSyncing: boolean = false;
  syncSuccess: boolean = false;

  // Edit Parameters Modal
  showParamModal: boolean = false;
  modalParamType: 'margin' | 'grace' | 'stock' = 'margin';
  paramModalTitle: string = '';
  paramModalValue: number = 0;

  // Toast
  toastVisible: boolean = false;
  toastMessage: string = '';

  constructor(
    public settingsService: SettingsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentTemplate = this.settingsService.getSettings().whatsappTemplate;
  }

  get settings(): BoutiqueSettings {
    return this.settingsService.getSettings();
  }

  toggleEditTemplate(): void {
    if (this.isEditingTemplate) {
      // Save changes
      this.settingsService.updateWhatsappTemplate(this.currentTemplate);
      this.isEditingTemplate = false;
      this.showToast('Plantilla de WhatsApp guardada');
    } else {
      this.isEditingTemplate = true;
    }
  }

  triggerSync(): void {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.settingsService.triggerCloudSync().subscribe(() => {
      this.isSyncing = false;
      this.syncSuccess = true;
      this.showToast('¡Copia en la Nube sincronizada con éxito!');
      setTimeout(() => {
        this.syncSuccess = false;
      }, 3000);
    });
  }

  exportCatalog(): void {
    this.settingsService.downloadCatalogCSV();
    this.showToast('Descargando catálogo completo (CSV)...');
  }

  exportLedger(): void {
    this.settingsService.downloadLedgerCSV();
    this.showToast('Descargando balance contable (CSV)...');
  }

  openEditParam(type: 'margin' | 'grace' | 'stock'): void {
    this.modalParamType = type;
    if (type === 'margin') {
      this.paramModalTitle = 'Margen Objetivo Boutique (%)';
      this.paramModalValue = this.settings.targetMargin;
    } else if (type === 'grace') {
      this.paramModalTitle = 'Plazo para Cobro de Saldo (Días)';
      this.paramModalValue = this.settings.gracePeriodDays;
    } else if (type === 'stock') {
      this.paramModalTitle = 'Alerta Stock Crítico (Unidades)';
      this.paramModalValue = this.settings.criticalStockThreshold;
    }
    this.showParamModal = true;
  }

  closeParamModal(): void {
    this.showParamModal = false;
  }

  saveParam(): void {
    const val = Number(this.paramModalValue) || 0;
    if (this.modalParamType === 'margin') {
      this.settingsService.updateSettings({ targetMargin: val });
    } else if (this.modalParamType === 'grace') {
      this.settingsService.updateSettings({ gracePeriodDays: val });
    } else if (this.modalParamType === 'stock') {
      this.settingsService.updateSettings({ criticalStockThreshold: val });
    }
    this.closeParamModal();
    this.showToast('Parámetro actualizado');
  }

  logout(): void {
    if (confirm('¿Deseas cerrar la sesión administrativa de TRÍA Atelier?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3200);
  }
}
