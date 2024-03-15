import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TokenService } from '../../../services/token-service';

@Injectable({
  providedIn: 'root',
})
export class AllProductTransactionService {
  private baseUrl = '/portal/all-products';
  token = localStorage.getItem('fnc_accessToken');

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    websiteurl: `${environment.websiteUrl}`,
    channel: 'Mobile',
    Authorization: `Bearer ${this.token}`,
  });

  _tokenService = inject(TokenService);
  authToken: string;

  constructor(private http: HttpClient) {}

  private getHeaders(additionalHeaders: HttpHeaders = null): HttpHeaders {
    this.authToken = localStorage.getItem('fnc_accessToken');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      accept: 'application/json',
      websiteurl: `${environment.websiteUrl}`,
      channel: 'Mobile',
      Authorization: `Bearer ${this.authToken}`,
    });
  
    if (additionalHeaders) {
      additionalHeaders.keys().forEach(header => {
        headers = headers.append(header, additionalHeaders.get(header));
      });
    }

    return headers;
  }

  getAllProducts(): Observable<any> {

    let headers = this.getHeaders();


    return this.http.get<any[]>(this.baseUrl, {
      headers,
    });
  }
}
