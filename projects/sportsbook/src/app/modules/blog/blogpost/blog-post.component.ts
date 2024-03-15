import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { DataService } from '../service/setblog';
import { BlogDataService } from '../service/blog.data.service';
import { environment } from 'projects/sportsbook/src/environments/environment';


@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css'],
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, CommonModule,
  ],
})
export class BlogPostComponent implements OnInit {
  blogTitle: string | undefined;
  blogBanner: string | undefined;
  mainContent: string | undefined;
  currentPage = 0;
  itemsPerPage = 5;
  totalItems = 0;
  blogData: any;
  categories: any;
  categoryId: string = '';
  activeCategory: string = 'All';
  itemData: any;
  allBlogData: any[] = [];
  randomBlogData: any[] = [];
  blogContent: any;
  iamge_URL =environment.iamge_URL;
  constructor(private route: ActivatedRoute, private blogService: BlogService, private router: Router, private dataService: DataService, private blogDataService: BlogDataService) { }
  ngOnInit(): void {
    this.loadBlogItems(this.currentPage, this.itemsPerPage, this.activeCategory),
      this.blogService.getItems()
        .subscribe((data: any) => {
          this.categories = data.data;
          console.log("blog_category", this.categories)
        });


    this.route.params.subscribe((params) => {
      const slug = params['slug'];

      // Fetch blog data based on the slug
      this.blogService.getBlogItems(slug).subscribe(
        (response: any) => {
          this.blogContent = response.data[0];
          // Assuming the API returns an array, so we take the first item
          console.log('Blog Data:', this.blogContent);
        },
        (error) => {
          console.error('Error fetching blog data:', error);
        }
      );
    });



  }



  loadBlogItems(page: number, limit: number, category: string) {
    this.activeCategory = category; // Update the active category

    if (category === 'All') {
      this.blogService.getAllBlogItems(page, limit).subscribe(
        (response: any) => {
          this.blogDataService.setAllBlogData(response.data);
          const allBlogData = this.blogDataService.getAllBlogData();
          console.log('All Blog Data:', allBlogData);

          if (allBlogData) {
            // Shuffle and select 5 items
            this.blogData = this.getRandomBlogItems(allBlogData, 5);

            // Debugging: Log the shuffled data to the console
            console.log('Shuffled Blog Data:', this.blogData);
          } else {
            console.error('Error: Blog data is undefined');
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
          if (response && response.data && Array.isArray(response.data)) {

            const blogData = response.data.map((item: any) => item.blog_id);


            if (blogData.length > 0) {

              this.blogDataService.setAllBlogData(blogData);
              const allBlogData = this.blogDataService.getAllBlogData();

              if (allBlogData) {

                this.blogData = this.getRandomBlogItems(allBlogData, 5);

                console.log('Shuffled Blog Data:', this.blogData);
              } else {
                console.error('Error: Blog data is undefined');
                this.showDataNotFoundError();
              }
            } else {
              console.error('Error: Blog data array is empty');
              this.showDataNotFoundError();
            }
          } else {
            console.error('Error: Response or response.data is undefined or not an array');
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

  getRandomBlogItems(blogData: any[], count: number): any[] {
    if (!blogData || blogData.length === 0) {
      return [];
    }

    const shuffled = blogData.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the selected number of items
  }

  showAllBlogItems() {
    this.loadBlogItems(this.currentPage, this.itemsPerPage,'All');
  }

  showDataNotFoundError() {
    const reloadConfirmation = confirm('Data not found. Do you want to reload the page?');

    if (reloadConfirmation) {
      window.location.reload();
    }
  }

  onCategoryClick(categoryId: string) {
    this.currentPage = 1; // Reset to the first page when a new category is selected
    this.activeCategory = categoryId; // Update the active category to the clicked category ID
    this.loadBlogItems(this.currentPage, this.itemsPerPage, this.activeCategory);
  }
  replaceSpacesWithHyphens(input: string): string {
    if (!input) {
      return '';
    }
    return input.replace(/\s+/g, '-');
  }
  navigateToBlogPost(item: any) {
    const slug = this.replaceSpacesWithHyphens(item.slug);

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

        // this.router.navigate(['/blog-content', slug]);
        const url = '#/blog/' + slug;
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error fetching blog post:', error);
        // Handle the error as needed
      }
    );
  }
}


