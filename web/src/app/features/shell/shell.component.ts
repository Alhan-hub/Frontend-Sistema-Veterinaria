import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuditContextService } from '../../core/audit-context.service';
import { UsuarioService } from '../../core/services/usuario.service';

const SIDEBAR_KEY = 'shell_sidebar_collapsed';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit, AfterViewInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  @ViewChild('sidenavShell') private sidenavShell?: MatSidenavContainer;

  readonly audit = inject(AuditContextService);

  readonly usuarios = signal<any[]>([]);

  readonly sidebarCollapsed = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_KEY) === '1',
  );

  readonly nav = [
    { path: 'usuarios', label: 'Usuarios', icon: 'manage_accounts' },
    { path: 'propietarios', label: 'Propietarios', icon: 'person' },
    { path: 'mascotas', label: 'Mascotas', icon: 'pets' },
    { path: 'citas', label: 'Citas', icon: 'calendar_today' },
    { path: 'facturas', label: 'Facturas', icon: 'receipt_long' },
    { path: 'vacunas', label: 'Vacunas', icon: 'vaccines' },
  ];

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: (rows) => this.usuarios.set(rows),
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 5000 }),
    });
  }

  ngAfterViewInit(): void {
    this.syncMargins();
  }

  private syncMargins(): void {
    this.sidenavShell?.updateContentMargins();
  }

  toggleSidebar(): void {
    const next = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(next);
    localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
    queueMicrotask(() => this.syncMargins());
    window.setTimeout(() => this.syncMargins(), 80);
    window.setTimeout(() => this.syncMargins(), 360);
  }

  logout(): void {
    this.audit.clear();
    void this.router.navigateByUrl('/login');
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}