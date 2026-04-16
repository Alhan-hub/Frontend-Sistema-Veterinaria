import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FacturaService } from '../../core/services/factura.service';
import { CitaService } from '../../core/services/cita.service';
import { PropietarioService } from '../../core/services/propietario.service';
import { FacturaRead, CitaRead, PropietarioRead } from '../../models/api.models';

export interface FacturaDialogData {
  mode: 'create' | 'edit';
  row?: FacturaRead;
}

@Component({
  selector: 'app-factura-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './factura-dialog.html',
})
export class FacturaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(FacturaService);
  private readonly citaSvc = inject(CitaService);
  private readonly propietarioSvc = inject(PropietarioService);
  private readonly dialogRef = inject(MatDialogRef<FacturaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<FacturaDialogData>(MAT_DIALOG_DATA);

  readonly citas = signal<CitaRead[]>([]);
  readonly propietarios = signal<PropietarioRead[]>([]);

  readonly form = this.fb.nonNullable.group({
    id_cita: ['', Validators.required],
    id_propietario: ['', Validators.required],
    id_usario_genera: ['', Validators.required],
    total: [0, Validators.required],
    metodo_pago: ['', Validators.required],
    fecha_pago: ['', Validators.required], 
  });
}