import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PropietarioCreate, PropietarioRead, PropietarioUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PropietarioService {
  private readonly base = `${environment.apiUrl}/propietarios`;

  constructor(private readonly http: HttpClient) { }

  list(): Observable<PropietarioRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<PropietarioRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<PropietarioRead> {
    return this.http.get<PropietarioRead>(`${this.base}/${id}`);
  }

  create(body: PropietarioCreate): Observable<PropietarioRead> {
    return this.http.post<PropietarioRead>(`${this.base}/`, body);
  }

  update(id: string, body: PropietarioUpdate): Observable<PropietarioRead> {
    return this.http.put<PropietarioRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
