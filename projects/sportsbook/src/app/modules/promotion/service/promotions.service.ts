import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root',
})
export class PromoService {
  private endPoint = 'promo';
  private baseUrl : string

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseUrl = environment.BASE_URL
    
  }
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getPromoItems(page?: number, limit?: number) {
   const headers = this.getHeaders();
    const url = `${this.baseUrl}${this.endPoint}?meta=*&page=${page}&limit=${limit}`;
    return this.http.get(url,
      { headers: headers });
  }

  getPromoSlugItems(slug: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.baseUrl}${this.endPoint}?filter[slug][_eq]=${slug}`,
      { headers: headers }
    );
  }
}
// ?meta=*&page=${page}&limit=${limit}