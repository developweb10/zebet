import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl:string;
  private endpoint ='top_nav?fields=*,mobile_nav_items.mobile_nav_items_id.*';
  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseUrl = environment.BASE_URL
  }
 
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getTopNavItems(): Observable<any> {
    const headers = this.getHeaders();
   
    return    this.http.get(`${this.baseUrl}${this.endpoint}`,
    { headers: headers });
    
  }
 
}
