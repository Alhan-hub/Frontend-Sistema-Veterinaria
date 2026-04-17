import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { VacunaService } from '../../core/services/vacuna.service';
import { MascotaService } from '../../core/services/mascota.service'; // Asumiendo que existe
import { VacunaRead, MascotaRead } from '../../models/api.models';

export interface VacunaDialogData {
  mode: 'create' | 'edit';
  row?: VacunaRead;
}

@Component({
  selector: 'app-vacuna-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './vacuna-dialog.html',
})
export class VacunaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(VacunaService);
  private readonly mascotaSvc = inject(MascotaService);
  private readonly dialogRef = inject(MatDialogRef<VacunaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<VacunaDialogData>(MAT_DIALOG_DATA);

  readonly mascotas = signal<MascotaRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    costo: [0, [Validators.required, Validators.min(0)]],
    id_mascota: ['', Validators.required],
    id_usuario_registra: ['', Validators.required],
  });

  ngOnInit(): void {
    // Cargamos la lista de mascotas para el select
    this.mascotaSvc.list().subscribe({
      next: (rows) => this.mascotas.set(rows),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });

    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        costo: r.costo,
        id_mascota: r.id_mascota,
        id_usuario_registra: r.id_usuario_registra,
      });
      
      // En modo edición, el ID de mascota y usuario suelen ser fijos
      this.form.controls.id_mascota.disable();
      this.form.controls.id_usuario_registra.disable();
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create(v).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    // Para actualización, enviamos solo nombre y costo según VacunaUpdate
    this.svc.update(this.data.row!.id_vacuna, {
      nombre: v.nombre || null,
      costo: v.costo ?? null,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}