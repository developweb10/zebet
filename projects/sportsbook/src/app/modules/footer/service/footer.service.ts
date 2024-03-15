// footer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private apiUrl = 'footer?fields=*,social_links.footer_social_link_id.*,supported_payment_method_images.directus_files_id';
  private Base_Url : string
  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.Base_Url = environment.BASE_URL
  }

  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getFooterData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.Base_Url}${this.apiUrl}`,
    { headers: headers });
  }
}
