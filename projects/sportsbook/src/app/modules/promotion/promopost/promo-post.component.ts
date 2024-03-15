import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { PromoService } from '../service/promotions.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { environment } from 'projects/sportsbook/src/environments/environment';




@Component({
  selector: 'app-promo-post',
  templateUrl: './promo-post.component.html',
  styleUrls: ['./promo-post.component.css'],
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, CommonModule,
  ],
})
export class PromoPostComponent implements OnInit {
  promoTitle: string | undefined;
  promoBanner: string | undefined;
  mainContent: string | undefined;
  currentPage = 0;
  itemsPerPage = 2;
  totalItems = 0;
  categories: any;
  categoryId: string = '';
  activeCategory: string = 'All';
  promoData: any;
  sanitizedHtml!: SafeHtml;
  buttonurlContent: any;
  promoContent:any;
  iamge_URL =environment.iamge_URL;

  constructor(private route: ActivatedRoute, private promoService: PromoService, private router: Router,private sanitizer: DomSanitizer,) { }
  ngOnInit(): void {
    this.loadPromoItems(this.currentPage, this.itemsPerPage)
    this.route.queryParams.subscribe((queryParams) => {
      this.promoBanner = queryParams['banner'];
      this.mainContent = queryParams['main_content'];
      this.buttonurlContent = queryParams['button_url'];

      console.log("Banner:", this.promoBanner);
      console.log("Main Content:", this.mainContent);
    });

    this.route.params.subscribe((params) => {
      const slug = params['slug'];

      // Fetch blog data based on the slug
      this.promoService.getPromoSlugItems(slug).subscribe(
        (response: any) => {
          this.promoContent = response.data[0];
       // Assuming the API returns an array, so we take the first item
          console.log('Blog Data:', this.promoContent);
        },
        (error) => {
          console.error('Error fetching blog data:', error);
        }
      );
    });
  
  }



  loadPromoItems(page: number, limit: number) {
    this.promoService.getPromoItems(page, limit).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.promoData = response.data;
          const apiHtml = this.promoData.htmlContent;
          this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(apiHtml);
          this.totalItems = response.meta.total_count;
        } else {
          // Data not found, show alert and reload option
          this.showDataNotFoundError();
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Data not found, show alert and reload option
        this.showDataNotFoundError();
      }
    );
  }

  showDataNotFoundError() {
    const reloadConfirmation = confirm('Data not found. Do you want to reload the page?');

    if (reloadConfirmation) {
      window.location.reload();
    }
  }

  showAllpromoItems() {
    this.loadPromoItems(this.currentPage, this.itemsPerPage, );
  }

  onCategoryClick(categoryId: string) {
    this.currentPage = 1; // Reset to the first page when a new category is selected
    this.activeCategory = categoryId; // Update the active category to the clicked category ID
    this.loadPromoItems(this.currentPage, this.itemsPerPage);
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
}  