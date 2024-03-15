import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TokenService } from '../../../services/token-service';

@Injectable({
  providedIn: 'root',
})
export class ProductTransactionService {
  private baseUrl = '/portal/product-transaction';
  token = localStorage.getItem('fnc_accessToken');

  private headers = {
    'Content-Type': 'application/json',
    accept: 'application/json',
    websiteurl: `${environment.websiteUrl}`,
    channel: 'Mobile',
    Authorization: `Bearer ${this.token}`,
  };

  _tokenService = inject(TokenService);
  authToken: string;

  constructor(private http: HttpClient) {}

  private getHeaders(additionalHeaders: HttpHeaders = null): HttpHeaders {

   this.authToken = localStorage.getItem('fnc_accessToken');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
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

  // this._tokenService.getTokenDetails().subscribe(data => {
  //   this.token = data.accessToken;
  //   this.headers.Authorization = `Bearer ${this.token}`;
  // })
  productTransactionType(requestBody: any, limit?: number): Observable<any> {
    const urlWithParams = `${this.baseUrl}?${
      limit ? 'limit=' + limit : ''
    }&offset=0`;

    let headers = this.getHeaders();

    return this.http.post(urlWithParams, requestBody, {
      headers
    });
  }
}
