import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CitaService } from '../../core/services/cita.service';
import { CitaRead, CitaCreate, CitaUpdate } from '../../models/api.models';

export interface CitaDialogData {
  mode: 'create' | 'edit';
  row?: CitaRead;
}

@Component({
  selector: 'app-cita-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './cita-dialog.html',
})
export class CitaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly dialogRef = inject(MatDialogRef<CitaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<CitaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_mascota: ['', Validators.required],
    id_usuario_agenda: ['', Validators.required],
    motivo: ['', Validators.required],
    costo: [0, [Validators.required, Validators.min(0)]],
    lugar: [''],
    estado: ['pendiente'],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_mascota: r.id_mascota,
        id_usuario_agenda: r.id_usuario_agenda,
        motivo: r.motivo,
        costo: r.costo,
        lugar: r.lugar ?? '',
        estado: r.estado,
      });
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
      const body: CitaCreate = {
        id_mascota: v.id_mascota,
        id_usuario_agenda: v.id_usuario_agenda,
        motivo: v.motivo,
        costo: v.costo,
        lugar: v.lugar || null,
        estado: v.estado,
      };
      this.citaService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    const id = this.data.row!.id_cita;
    const body: CitaUpdate = {
      motivo: v.motivo,
      costo: v.costo,
      lugar: v.lugar || null,
      estado: v.estado,
    };
    this.citaService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),
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