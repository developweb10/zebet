import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT_MS = 3600000; // 1 hour in milliseconds

  constructor(private router: Router) {}

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_TIMEOUT_MS);
  }

  logout() {
    // Perform logout actions here, e.g., clearing local storage and navigating to the login page.
    // Replace this with your actual logout logic.
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']); // Navigate to the login page after logout.
  }
}
