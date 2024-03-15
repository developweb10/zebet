import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  
  private baseurl : string
  private devurl : string

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseurl = environment.BASE_URL
  }
  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getHelpItems(page: number = 1, limit: number = 10): Observable<any> {
    const headers = this.getHeaders();
    const endPoint=`help?meta=*&page=${page}&limit=${limit}&fields=*,steps.help_component_id.*`;
    return this.http.get(`${this.baseurl}${endPoint}`,
    { headers: headers });
  }

  getHlepSlugItems(slug: string) {
 
    return this.http.get<any>(

      `${this.baseurl}help?fields=*,steps.help_component_id.*&filter[slug][_eq]=${slug}`
    );
  }

  getHelpTitle(): Observable<any> {
    const endPoint = 'help_group?fields=*,article.help_id.title,article.help_id.slug';
    return this.http.get<any>(`${this.baseurl}${endPoint}`);
  }
  
}
