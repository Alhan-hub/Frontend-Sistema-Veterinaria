import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MascotaCreate, MascotaRead, MascotaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly base = `${environment.apiUrl}/mascotas`;

  constructor(private readonly http: HttpClient) { }

  list(): Observable<MascotaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<MascotaRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<MascotaRead> {
    return this.http.get<MascotaRead>(`${this.base}/${id}`);
  }

  create(body: MascotaCreate): Observable<MascotaRead> {
    return this.http.post<MascotaRead>(`${this.base}/`, body);
  }

  update(id: string, body: MascotaUpdate): Observable<MascotaRead> {
    return this.http.put<MascotaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
