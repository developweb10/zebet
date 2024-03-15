import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromoService } from './service/promotions.service';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
})

export class PromotionsComponent implements OnInit {
  promoData: any;
  sanitizedHtml!: SafeHtml;
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  ASSETS_URL = environment.ASSETS_URL;
  isLoading: boolean =  true;


  constructor(private promoService: PromoService, private sanitizer: DomSanitizer, private router: Router) { }
  ngOnInit() {
    this.loadPromoItems(this.currentPage, this.itemsPerPage);
  }
  loadPromoItems(page: number, limit: number) {
    this.promoService.getPromoItems(page, limit).subscribe(
      (data: any) => {
        if (data && data.data) {
          this.promoData = data.data;
          const apiHtml = this.promoData.htmlContent;
          this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(apiHtml);
          this.totalItems = data.meta.total_count;
          console.log("1234567890-=", this.promoData);
        } else {
          // Data not found, show alert and reload option
          this.showDataNotFoundError();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Data not found, show alert and reload option
        this.showDataNotFoundError();
        this.isLoading = false;
      }
    );
  }

  showDataNotFoundError() {
    const reloadConfirmation = confirm('Data not found. Do you want to reload the page?');

    if (reloadConfirmation) {
      window.location.reload();
    }
  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadPromoItems(this.currentPage, this.itemsPerPage);
  }

  calculateTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  replaceSpacesWithHyphens(input: string): string {
    if (!input) {
      return '';
    }
    return input.replace(/\s+/g, '-');
  }


  navigateToPromoPost(item: any) {
    const slug = this.replaceSpacesWithHyphens(item.slug);

    // Call the getBlogItems API with the provided slug
    this.promoService.getPromoSlugItems(slug).subscribe(
      (response) => {
        // Handle the response as needed
        console.log('Promo post data:', response);

        // Now, you can navigate to the '/blog-content/:slug' route
        const queryParams = {
          banner: item.banner,
          main_content: item.main_content,
          button_url: item.button_url,
        };

        const navigationExtras: NavigationExtras = {
          queryParams: queryParams,
          queryParamsHandling: 'merge',
          skipLocationChange: true,
        };

        // this.router.navigate(['/promotion-content', slug]);
        const url = 'promotion/' + slug;
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error fetching blog post:', error);
        // Handle the error as needed
      }
    );
  }

  // ngOnInit(): void {
  //   this.promoService.getPromoItems(1, 10).subscribe(
  //     (data: any) => {
  //       this.promoData = data.data;
  //       const apiHtml = this.promoData.htmlContent;


  //       this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(apiHtml);

  //       console.log(this.promoData);
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }
}
