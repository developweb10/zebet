import { Component, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ZEbet';
  showChatIcon: boolean = false;
  currentUrl: string = '';
  showChatFrame: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScrollPositionHideChat();
  }

  constructor(private toastr: ToastrService,private router: Router,private seoService: SeoService) { }

  showToastMessage() {
    this.toastr.success('Login successful!', 'Success');
  }
  showInitialContent: boolean = true;

  ngOnInit(): void {
    this.seoContent();
    this.handleQueryParams();
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Get the current URL without the fragment identifier
      this.currentUrl = this.router.url.split('#')[0];

      // Check if the current URL starts with '/sports-book'
      this.showChatIcon = this.currentUrl.startsWith('/sports-book');
      this.showInitialContent = this.currentUrl.includes('/affiliate-program');
      // Log the values in the console
      // console.log('Current URL:', this.currentUrl);
      // console.log('Show Chat Icon:', this.showChatIcon);
    });

    // Set the time limit for inactivity (in milliseconds)
    const inactivityTimeLimit = 3600000; // 1 Hour

    let inactivityTimer;

    // Function to reset the inactivity timer
    function resetInactivityTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleInactive, inactivityTimeLimit);
    }

    // Function to handle user inactivity
    function handleInactive() {
      // Perform actions when the user is inactive
      if(window.location.href.includes('sports-book') || window.location.href.includes('live-sports'))  location.reload();
      // For example, you can display a message or log the user out
    }

    // Event listeners to reset the inactivity timer on user interaction
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keydown", resetInactivityTimer);
    document.addEventListener("click", resetInactivityTimer);
    // document.addEventListener('touchend',resetInactivityTimer);

    // Initialize the inactivity timer
    resetInactivityTimer();

  }
  seoContent() {
    let currentURL = window.location.href;

    let url = currentURL.replace(/#\/+/g, '');
    this.seoService.getSeoDataForUrl(url);
  }

  handleQueryParams(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Get the complete URL after navigation is complete

        const url = window.location.href;
        console.log("Complete URL:", url);
        // Check if the URL contains 'stag' query parameter
        if (url.includes('?stag=')) {
          // Parse the URL to get query parameters
          const StagUrl = window.location.href;
          console.log("stagURL",StagUrl)
         
          if (StagUrl) {
            // Store the 'stag' value in local storage
            localStorage.setItem('stag', StagUrl);
          }
        }
      });
  }
  

  getQueryParamValue(url: string, param: string): string {
    // Parse the URL and extract query parameters
    const queryParams = new URLSearchParams(url.split('?')[1]);
    // Return the value of the specified parameter
    return queryParams.get(param) || '';
  }

  checkAndDeleteStagItem(): void {
    const stagItem = localStorage.getItem('stag');
    if (stagItem) {
      const data = JSON.parse(stagItem);
      
      // Get the current date
      const currentDate = new Date();
  
      // Check if the current date exceeds the expiration date
      if (currentDate.getTime() > data.expirationDate) {
        // If expired, remove the localStorage item
        localStorage.removeItem('stag');
      }
    }
  }

  checkScrollPositionHideChat() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (scrollPosition + viewportHeight >= totalHeight - 400 && this.showChatIcon) {
      if (!this.showChatFrame) {
        this.showChatFrame = true;
        this.toggleChatFrameDisplay('block');
      }
    } else {
      if (this.showChatFrame) {
        this.showChatFrame = false;
        this.toggleChatFrameDisplay('none');
      }
    }
  }

  toggleChatFrameDisplay(displayValue: string) {
    const fcFrame = document.getElementById('fc_frame');
    if (fcFrame) {
      fcFrame.style.display = displayValue;
    }
  }

}
