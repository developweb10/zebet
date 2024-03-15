import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class SportsBettingRuleService {
  private endPoint = 'sports_betting_rules';
  private baseUrl : string

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) { 
    this.baseUrl =  environment.BASE_URL
  }
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getSportsBettingRule(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}${this.endPoint}`,
    { headers: headers });
  }
}
