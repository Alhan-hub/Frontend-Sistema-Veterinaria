import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { CitaService } from '../../core/services/cita.service';
import { CitaRead } from '../../models/api.models';
import { CitaDialogComponent, CitaDialogData } from './cita-dialog';

@Component({
  selector: 'app-cita-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.scss',
})
export class CitaListComponent implements AfterViewInit {
  private readonly citaService = inject(CitaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['motivo', 'costo', 'lugar', 'estado', 'fecha_hora', 'acciones'];
  readonly dataSource = new MatTableDataSource<CitaRead>([]);

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.citaService.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog({ mode: 'create' });
  }

  editar(row: CitaRead): void {
    this.openDialog({ mode: 'edit', row });
  }

  private openDialog(data: CitaDialogData): void {
    this.dialog
      .open(CitaDialogComponent, { width: '520px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: CitaRead): void {
    if (!confirm(`¿Eliminar cita de ${row.motivo}?`)) return;
    this.citaService.delete(row.id_cita).subscribe({
      next: () => {
        this.snack.open('Cita eliminada', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}