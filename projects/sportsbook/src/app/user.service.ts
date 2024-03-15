import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isNewUser: boolean;

  constructor() {
    this.isNewUser = !localStorage.getItem('visitedBefore');
  }

  isNewUserCheck(): boolean {
    return this.isNewUser;
  }

  markAsVisited(): void {
    this.isNewUser = false;
    localStorage.setItem('visitedBefore', 'true');
  }
}
