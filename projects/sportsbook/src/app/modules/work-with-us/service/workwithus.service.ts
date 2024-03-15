import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root',
})
export class WorkWithUsService {
  private baseUrl :string
  private endPoint = 'work_with_us';
  private carriersApiUrl = 'carriers?limit=10&page=1';


  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseUrl =  environment.BASE_URL
  }

  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getWorkWithUs(): Observable<any> {
     const headers = this.getHeaders();     
    return this.http.get(`${this.baseUrl}${this.endPoint}`,   { headers: headers });
  }
  getCarriers(): Observable<any> {
      const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}${this.carriersApiUrl}` ,   { headers: headers });
  }
}
