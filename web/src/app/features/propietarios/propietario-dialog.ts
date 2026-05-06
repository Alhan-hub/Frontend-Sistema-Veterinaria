import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PropietarioService } from '../../core/services/propietario.service';
import { PropietarioRead, PropietarioCreate, PropietarioUpdate } from '../../models/api.models';

export interface PropietarioDialogData {
  mode: 'create' | 'edit';
  row?: PropietarioRead;
}

@Component({
  selector: 'app-propietario-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './propietario-dialog.html',
})
export class PropietarioDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly propietarioService = inject(PropietarioService);
  private readonly dialogRef = inject(MatDialogRef<PropietarioDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PropietarioDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    email: [''],
    id_usuario_auditoria: ['', Validators.required], // Se usa para creacion o edicion
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        telefono: r.telefono,
        email: r.email ?? '',
        id_usuario_auditoria: '', // Se deja vacío para que el usuario ingrese su ID al editar
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
      const body: PropietarioCreate = {
        nombre: v.nombre,
        telefono: v.telefono,
        email: v.email || null,
        id_usuario_creacion: v.id_usuario_auditoria,
      };
      this.propietarioService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    
    const id = this.data.row!.id_propietario;
    const body: PropietarioUpdate = {
      nombre: v.nombre,
      telefono: v.telefono,
      email: v.email || null,
      id_usuario_edita: v.id_usuario_auditoria,
    };
    this.propietarioService.update(id, body).subscribe({
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
