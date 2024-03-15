// auth.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthLogoutService {
  private logoutSubject = new Subject<void>();

  logout() {
    // Your existing logout logic...

    // Emit an event to notify other components
    this.logoutSubject.next();
  }

  getLogoutObservable() {
    return this.logoutSubject.asObservable();
  }
}
