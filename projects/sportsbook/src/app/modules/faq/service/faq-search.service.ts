import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class FAQSearchService {
  private apiUrl = 'faq_data';
  private Base_Url: string;

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.Base_Url = environment.BASE_URL;
  }
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getFAQSearch(searchTerm: string): Observable<any> {
    // Create HTTP parameters with the search query
    const headers = this.getHeaders();
    const params = new HttpParams().set('search', searchTerm);
    const requestOptions = {
      params: params,
      headers: this.getHeaders()
    };
  
    // Make the GET request with the parameters
    return this.http.get(`${this.Base_Url}${this.apiUrl}`, requestOptions);
  }
}
