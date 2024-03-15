import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { CMStokenService } from '../../../cmsToken.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  getBlogCategories() {
    throw new Error('Method not implemented.');
  }
  setBlogData(item: any) {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string;

  constructor(private http: HttpClient, private cmsTokenService: CMStokenService) {
    this.baseUrl = environment.BASE_URL
  }

  private getHeaders(): HttpHeaders {
    const headers = this.cmsTokenService.getAuthorizationHeader(); // Get authorization header from CMStokenService
    return headers;
  }

  getBlogItems(slug: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.baseUrl}blog?filter[slug][_eq]=${slug}`,
      { headers: headers }
    );
  }

  getAllBlogItems(page: number, limit: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.baseUrl}blog?meta=*&page=${page}&limit=${limit}&sort=-publish_date_time`,
      { headers: headers }
    );
  }

  getItems(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.baseUrl}blog_category?sort[]=rank`,
      { headers: headers }
    );
  }

  getBlogItemsByCategory(page: number, limit: number, category: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.baseUrl}blog_blog_category?meta=*&page=${page}&limit=${limit}&fields=blog_id.*&filter[blog_category_id][_eq]=${category}&sort=-blog_id.date_created`,
      { headers: headers }
    );
  }
}
