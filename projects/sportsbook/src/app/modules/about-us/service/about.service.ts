import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private apiUrl_endpoint = 'about_us';
  private Base_URl : string 
  

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService ) {
    this.Base_URl = environment.BASE_URL
  }

  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getAboutUs(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.Base_URl}${this.apiUrl_endpoint}`,
    { headers: headers });
  }
}
