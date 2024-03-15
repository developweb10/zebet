import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { MyBetEnum } from './shared/cashout-offer/my-bet.enum';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  description = "ZEbet offers the highest odds, fast deposits, &amp; withdrawals, with multiple market options and the best live betting experience. Register now &amp; start winning"; 
  urlLink = environment.URL_LINK;
  title = 'Best Online sports betting platform in Nigeria | Top live odd website | ZEbet';
  keyword = [];
  constructor(private http: HttpClient, private router: Router, private meta: Meta,
    public pageTitle: Title, @Inject(DOCUMENT) private dom) {
    this.listenToRouteChanges();
  }

  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentURL = window.location.href;

       let url = currentURL.replace(/#\/+/g, '');

        this.getSeoDataForUrl(url);
         // Trigger the subscription
      });
  }

  getSeoDataForUrl(url: string) {
    const apiUrl = `${environment.BASE_URL}seo?filter[url][_eq]=${(url)}`;

    this.http.get(apiUrl).subscribe(
      (response:any) => {
        console.log('API Response:', response?.data);
        if(response?.data?.length){
          const metaData = response.data[0];
          if(metaData?.meta_description){
            this.setMetaTag(metaData.meta_description);
          }else{
            this.setMetaTag(this.description);
          }
          if(metaData?.title){
            this.setPageTitle(metaData.title);
          }else{
            this.setPageTitle(this.title);
          }
          if(metaData?.url){
            this.updateCanonicalUrl(metaData.url)
          }else{
            this.updateCanonicalUrl(this.urlLink);
          }
          if(metaData?.meta_tags){
            this.setMetaKeyword(metaData.meta_tags);
          }else{
            this.setMetaKeyword(this.keyword);
          }
        }else{
          this.setMetaTag(this.description);
          this.setPageTitle(this.title);
          this.updateCanonicalUrl(this.urlLink);
          this.setMetaKeyword(this.keyword);
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.setMetaTag(this.description);
        this.setPageTitle(this.title);
        this.updateCanonicalUrl(this.urlLink);
        this.setMetaKeyword(this.keyword);
      }
    );
  }

  setMetaTag(description){
    this.meta.updateTag({ name: 'description', content: description });
   
  }
  setPageTitle(title){
    this.pageTitle.setTitle(title); 
  }
  setMetaKeyword(keyword){
      this.meta.updateTag({ name: 'keywords', content: keyword?.join(', ') });
  }
  updateCanonicalUrl(url:string){
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement= this.dom.querySelector(`link[rel='canonical']`) || null
    if (element==null) {
      element= this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel','canonical')
    element.setAttribute('href',url)
  }
}
