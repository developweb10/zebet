import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HelpService } from './service/help.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'projects/sportsbook/src/environments/environment';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HelpComponent implements OnInit {
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
  isLoading: boolean = true;

  constructor(private helpService: HelpService, private sanitizer: DomSanitizer, private router: Router) { }

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
          this.selectedContent = this.mainContent[0]
          this.router.navigate(['/help', this.selectedContent.slug]);
          console.log("1234567890",this.selectedContent.slug)
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
    const activeTab = sessionStorage.getItem('activeTab');
    if (activeTab) {
      this.selectedContent = JSON.parse(activeTab);
      // Set isActive to true for the active tab
      this.mainContent.forEach(item => item.isActive = (item === this.selectedContent));
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

  onTitleClick(content: any): void {
    // Reset isActive for all items
    
    this.mainContent.forEach(item => item.isActive = (item === content));

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
  
  


  onCloseClick() {
    this.searchText = '';  // Clear the search text
    // Additional logic to close the dropdown if needed
  }

}