import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {
  private endpoint = 'privacy_policy';
  private baseurl :string 

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseurl = environment.BASE_URL
   }

   private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getPrivacyPolicy(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseurl}${this.endpoint}`,
    { headers: headers });
  }
}
