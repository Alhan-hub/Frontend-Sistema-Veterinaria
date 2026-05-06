import { Routes } from '@angular/router';

import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'propietarios',
        loadComponent: () =>
          import('./features/propietarios/propietario-list').then((m) => m.PropietarioListComponent),
      },
      {
        path: 'mascotas',
        loadComponent: () =>
          import('./features/mascotas/mascota-list').then((m) => m.MascotaListComponent),
      },
      {
        path: 'vacunas',
        loadComponent: () =>
          import('./features/vacunas/vacuna-list').then((m) => m.VacunaListComponent),
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./features/facturas/factura-list').then(
            (m) => m.FacturaListComponent,
          ),
      },
      {
        path: 'citas',
        loadComponent: () => import('./features/citas/cita-list').then((m) => m.CitaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];