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

