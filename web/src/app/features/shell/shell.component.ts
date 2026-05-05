import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatButtonModule, MatMenuModule,
    MatSelectModule, MatTooltipModule, MatDividerModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private readonly router = inject(Router);

  isCollapsed = false;
  selectedUserId = '123-abc';

  // Arreglo completo con todas las entidades para la navegación
  readonly entities = [
    { label: 'Usuarios', path: '/usuarios', icon: 'manage_accounts' },
    { label: 'Propietarios', path: '/propietarios', icon: 'person' },
    { label: 'Mascotas', path: '/mascotas', icon: 'pets' },
    { label: 'Citas', path: '/citas', icon: 'calendar_today' },
    { label: 'Facturas', path: '/facturas', icon: 'receipt_long' },
    { label: 'Vacunas', path: '/vacunas', icon: 'vaccines' }
  ];

  // Usuarios simulados para el selector de auditoría
  readonly users = [
    { id: '123-abc', name: 'Dev1' },
    { id: '456-def', name: 'Dev2' },
    { id: '789-ghi', name: 'Dev3' },
    { id: '012-jkl', name: 'Dev4' }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  updateAuditUser() {
    localStorage.setItem('audit_user_id', this.selectedUserId);
    console.log('Usuario de auditoría cambiado a:', this.selectedUserId);
  }

  logout() {
    if (confirm('¿Deseas cerrar sesión?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
