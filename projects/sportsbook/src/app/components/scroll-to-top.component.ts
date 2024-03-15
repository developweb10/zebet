import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scroll-to-top',
  template: '<ng-content></ng-content>', // This component has no visible content
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page when a route changes
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
