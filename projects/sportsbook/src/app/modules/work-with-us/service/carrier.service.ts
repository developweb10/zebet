import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
    private baseUrl = environment.ASSETS_URL;

    constructor(private http: HttpClient) {}
  
    getItems(): Observable<any> {
      return this.http.get(`${this.baseUrl}items/carriers?limit=10&page=1`);
    }
  }