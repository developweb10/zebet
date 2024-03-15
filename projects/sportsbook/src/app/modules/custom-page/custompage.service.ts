import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class CustomPageService {

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) { }
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getCustomPageData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${environment.BASE_URL}/custom_pages`,
    { headers: headers });
  }

  getPageData(title): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${environment.BASE_URL}/custom_pages?filter[title]=${title}`,
    { headers: headers });
  }
}
