import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  ASSETS_URL = environment.ASSETS_URL;

  private apiUrl = 'contactus?fields=*,cards.contact_us_card_id.*';
  private Base_Url : string;
  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.Base_Url=environment.BASE_URL
  }

  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getContactUsData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.Base_Url}${this.apiUrl}`,
    { headers: headers });
  }

}
