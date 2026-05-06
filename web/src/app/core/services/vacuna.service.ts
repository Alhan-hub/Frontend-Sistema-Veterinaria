import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VacunaCreate, VacunaRead, VacunaUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private readonly base = `${environment.apiUrl}/vacunas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<VacunaRead[]> {
    // Mantengo el límite de 500 que tenías en facturas
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<VacunaRead[]>(`${this.base}`, { params });
  }

  get(id: String): Observable<VacunaRead> {
    return this.http.get<VacunaRead>(`${this.base}/${id}`);
  }

  create(body: VacunaCreate): Observable<VacunaRead> {
    return this.http.post<VacunaRead>(`${this.base}`, body);
  }

  update(id: String, body: VacunaUpdate): Observable<VacunaRead> {
    return this.http.put<VacunaRead>(`${this.base}/${id}`, body);
  }

  delete(id: String): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' })
      .pipe(
        map(() => undefined)
      );
  }
}