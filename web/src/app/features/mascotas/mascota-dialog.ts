import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MascotaService } from '../../core/services/mascota.service';
import { MascotaRead, MascotaCreate, MascotaUpdate } from '../../models/api.models';

export interface MascotaDialogData {
  mode: 'create' | 'edit';
  row?: MascotaRead;
}

@Component({
  selector: 'app-mascota-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './mascota-dialog.html',
})
export class MascotaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly dialogRef = inject(MatDialogRef<MascotaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<MascotaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    id_propietario: ['', Validators.required],
    tipo_mascota: ['', Validators.required],
    raza: [''],
    edad: [0, [Validators.required, Validators.min(0)]],
    id_usuario_auditoria: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        id_propietario: r.id_propietario,
        tipo_mascota: r.tipo_mascota,
        raza: r.raza ?? '',
        edad: r.edad,
        id_usuario_auditoria: '', 
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
      const body: MascotaCreate = {
        nombre: v.nombre,
        id_propietario: v.id_propietario,
        tipo_mascota: v.tipo_mascota,
        raza: v.raza || null,
        edad: v.edad,
        id_usuario_creacion: v.id_usuario_auditoria,
      };
      this.mascotaService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    
    const id = this.data.row!.id_mascota;
    const body: MascotaUpdate = {
      nombre: v.nombre,
      id_propietario: v.id_propietario,
      tipo_mascota: v.tipo_mascota,
      raza: v.raza || null,
      edad: v.edad,
      id_usuario_edita: v.id_usuario_auditoria,
    };
    this.mascotaService.update(id, body).subscribe({
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
