import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  private apiUrl = 'faq_data';
  private Base_Url : String;

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.Base_Url = environment.BASE_URL
   }
   private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getFAQ(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.Base_Url}${this.apiUrl}`,
    { headers: headers });
  }
}
