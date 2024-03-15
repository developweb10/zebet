import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelpService } from '../service/help.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'projects/sportsbook/src/environments/environment';
@Component({
  selector: 'app-help-content',
  templateUrl: './help-content.component.html',
  styleUrls: ['./help-content.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HelpContentComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  searchText: string = '';
  mainContent: any[] = [];  // Use an array to store multiple main content items
  steps: any[] = [];        // Use an array to store multiple steps
  sanitizedHtml!: SafeHtml;
  ASSETS_URL = environment.ASSETS_URL;
  isSectionVisible = false;
  Show = true;
  Hide = false;
  selectedContent: any;
  searchResults: any[] = [];
  isSearchBoxActive = false;
  helpContent: any
  isLoading: boolean = true;
  helpTitles: any[] = [];
  selectedTitle: any;
  selectedArticleSlug: string;
  isDropdownOpen: boolean = false; 
  articles: any;
  activeDropdownIndex: number | null = null;
  filteredArticles: any[] = [];
  activeTitleId: string | null = null;
  activeArticleId: string | null = null; 


  constructor(private helpService: HelpService, private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute) { 
    
  }

  onSearchInput(event: any) {
    this.searchText = event.target.value;

    // Implement your search logic here and update searchResults
    // For example, filter titles based on the search text
    this.searchResults = this.mainContent.filter(content =>
      content.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSearchBoxFocus() {
    this.isSearchBoxActive = true;
  }

  onSearchBoxBlur() {
    this.isSearchBoxActive = false;
  }

  onSearch() {
    this.search.emit(this.searchText);
  }

  ngOnInit(): void {
    this.helpService.getHelpItems(1, 10).subscribe(
      (data: any) => {
        if (data.data && data.data.length > 0) {
          this.mainContent = data.data;
          this.steps = data.data.flatMap((item: any) => item.steps);
          this.selectedContent = this.mainContent[0];
  
          // Set initial active item after data is loaded
          const slug = this.route.snapshot.params['slug'];
          if (slug) {
            const matchingItem = this.mainContent.find(item => item.slug === slug);
            if (matchingItem) {
              this.mainContent.forEach(item => {
                item.isActive = item === matchingItem;
              });
              this.selectedContent = matchingItem;
            } else {
              console.error('No matching item found for slug:', slug);
            }
          }
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
  
      // Fetch blog data based on the slug
      this.helpService.getHlepSlugItems(slug).subscribe(
        (response) => {
          this.helpContent = response.data;
          console.log("help content", this.helpContent)
        },
        (error) => {
          console.error('Error occurred:', error);
        }
 
      );
    });
    this.helpService.getHelpTitle().subscribe(
      (response) => {
        this.helpTitles = response.data;
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    )
  }
  

  onTitleClick(content: any): void {
    // Reset isActive for all items
    
    this.mainContent.forEach(item => item.isActive = (item === content));
    this.activeArticleId = null;
    this.selectedContent = content;

    if (content.slug) {
      const slug = content.slug;

      // Call the API for the selected help item's slug
      this.helpService.getHlepSlugItems(slug).subscribe(
        (data: any) => {
          console.log('API Response:', data);

          // Find the index of the selected content in mainContent
          const index = this.mainContent.findIndex(item => item.slug === slug);

          if (index !== -1) {
            // Replace the selected content with the detailed information
            this.mainContent[index] = { ...data.data[0], isActive: true }; // Assuming data is an object with a 'data' property
          }

          // Navigate to the detailed view with the selected slug
          this.router.navigate(['/help', slug]);
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
      this.toggleSectionHide();
    }
    else {
      console.error('The clicked content does not have a slug property.');
    }
  }




  toggleSectionVisibility() {
    this.isSectionVisible = !this.isSectionVisible;
    this.Hide = true
    this.Show = false
  }
  toggleSectionHide() {
    this.isSectionVisible = !this.isSectionVisible;
    this.Show = true
    this.Hide = false
  }



  onCloseClick() {
    this.searchText = '';  // Clear the search text
    // Additional logic to close the dropdown if needed
  }

  toggleDropdown(): void {
    // Toggle the dropdown state
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onArticleClick(article: any) {
     // Reset isActive for all items
    this.mainContent.forEach(item => item.isActive = false);
    // Set the active article ID to the clicked article's ID
    this.activeArticleId = article.help_id.title;
  
    // Navigate to the corresponding route based on the clicked article's slug
    const slug = article.help_id.slug;
    this.router.navigate(['/help', slug]);
  }
  
  
  
  onTitleSelect(titleId: string): void {
    if (this.activeTitleId === titleId) {
      // If the clicked title is already active, close the dropdown
      this.activeTitleId = null;
      this.isDropdownOpen = false;
    } else {
      // Set the clicked title as active
      this.activeTitleId = titleId;
      
      // Filter articles related to the selected main title
      const selectedTitle = this.helpTitles.find(item => item.id === titleId);
      if (selectedTitle) {
        this.filteredArticles = selectedTitle.article;
      }
  
      // Open the dropdown
      this.isDropdownOpen = true;
    }
  }
  

}