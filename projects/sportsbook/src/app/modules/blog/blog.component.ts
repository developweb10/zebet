import { Component, OnInit, AfterViewInit, NO_ERRORS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BlogService } from './service/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import Swiper from "swiper";
import { NavigationExtras, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from './service/setblog';
import { BlogDataService } from './service/blog.data.service';
import { environment } from 'projects/sportsbook/src/environments/environment';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [MatCardModule, MatButtonModule, CommonModule],
})

export class BlogComponent implements OnInit {
  storedData = localStorage.getItem('accessToken');
  name = "Angular";
  blogData: any;
  sanitizedHtml!: SafeHtml;
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  blog: any;
  categories: any;
  categoryId: string = '';
  activeCategory: string = 'All';
  ASSETS_URL = environment.ASSETS_URL;
  isLoading: boolean = true;

  constructor(private blogService: BlogService, private router: Router, private dataService: DataService, private blogDataService: BlogDataService) { }

  ngOnInit(): void {
    this.loadBlogItems(this.currentPage, this.itemsPerPage, this.activeCategory);
    this.blogService.getItems()
    .subscribe((data: any) => {
      this.categories = data.data;
      console.log("blog_category", this.categories)
      this.isLoading = false;
      });
  }


  loadBlogItems(page: number, limit: number, category: string) {
    this.activeCategory = category; // Update the active category
    console.log("category", category)
    if (category === 'All') {
      this.blogService.getAllBlogItems(page, limit).subscribe(
        (response: any) => {
          this.blogDataService.setAllBlogData(response.data);
          if (response && response.data) {
            // Sort blog items by publish_date_time in descending order
            this.blogData = response.data.sort((a, b) => {
              return new Date(b.publish_date_time).getTime() - new Date(a.publish_date_time).getTime();
            }) ;
            this.totalItems = response.meta.total_count;
          } else {
            this.showDataNotFoundError();
          }
        },
        (error) => {
          console.error('Error fetching all blogs:', error);
          this.showDataNotFoundError();
        }
      );
    } else {
      this.blogService.getBlogItemsByCategory(page, limit, category).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Sort blog items by publish_date_time in descending order
            this.blogData = response.data.filter((x) => x.blog_id).sort((a, b) => {
              return new Date(b.publish_date_time).getTime() - new Date(a.publish_date_time).getTime();
            });
            this.totalItems = response.meta.total_count;
          } else {
            this.showDataNotFoundError();
          }
        },
        (error) => {
          console.error('Error fetching blogs by category:', error);
          this.showDataNotFoundError();
        }
      );
    }
  }




  showAllBlogItems() {
    this.loadBlogItems(this.currentPage, this.itemsPerPage, 'All');
  }
  onCategoryClick(categoryId: string) {
    this.currentPage = 1; // Reset to the first page when a new category is selected
    this.activeCategory = categoryId; // Update the active category to the clicked category ID
    this.loadBlogItems(this.currentPage, this.itemsPerPage, categoryId);
  }

  showDataNotFoundError() {
    const reloadConfirmation = confirm('Data not found. Do you want to reload the page?');

    if (reloadConfirmation) {
      window.location.reload();
    }
  }


  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadBlogItems(this.currentPage, this.itemsPerPage, this.activeCategory);
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

  navigateToBlogPost(item: any) {
    let slug: string;
    if (item.blog_id && item.blog_id.slug) {
      slug = this.replaceSpacesWithHyphens(item.blog_id.slug);
    } else if (item.slug) {
      slug = this.replaceSpacesWithHyphens(item.slug);
    } else {
      console.error('No slug found in the item.');
      return;
    }

    // Call the getBlogItems API with the provided slug
    this.blogService.getBlogItems(slug).subscribe(
      (response) => {
        // Handle the response as needed
        console.log('Blog post data:', response);

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
        const url = 'blog/' + slug;
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error fetching blog post:', error);
        // Handle the error as needed
      }
    );
  }



  customBlogOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    margin: 20,
    pullDrag: false,
    autoplay: true,
    dots: false,
    autoplayTimeout: 5000,
    navSpeed: 700,
    navText: ['<img src="assets/img/arrow-left.png">', '<img src="assets/img/arrow-right.png">'],
    responsive: {
      0: {
        items: 1.5
      },
      // 475: {
      //   items: 2.5
      // },
      // 576: {
      //   items: 3.5
      // },
      // 768: {
      //   items: 4
      // },
      // 991: {
      //   items: 5
      // }
    },
    nav: true
  };

  // Add a property to determine if pagination should be shown
  showPagination = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Adjust showPagination based on the window width
    if (window.innerWidth < 768) {
      this.showPagination = false;
    } else {
      this.showPagination = true;
    }
  }

}


