import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/my/userdetails';

  private notificationApiUrl = '/inbox/notification';
   private notificationDelApiUrl = '/inbox/notification/';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  private handleUnauthorizedError(error: any): Observable<never> {
    // if (this.isUnauthorizedError(error)) {
    //   // Display an alert with the error message
    //   const errorMessage = error?.error?.description || 'Unauthorized Access. Please login again.';
    //   alert(errorMessage);

    //   // Redirect to login-account page after 5 seconds
    //   setTimeout(() => {
    //     this.router.navigate(['/login-account']);
    //   }, 5000);
    // }
    return throwError(error);
  }

  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }



  getNotificationProperties(selectedDate?: Date): Observable<any> {
    const url  = selectedDate
    ? `${this.notificationApiUrl}?selectedDate=${selectedDate.toISOString()}`
    : this.notificationApiUrl;
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': `${environment.websiteUrl}`,
      'channel': 'Mobile',
      Authorization: `Bearer ${fnc_accessToken}`,
    });
    return this.http.get(url , { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  getNotificationDelete(id: string): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': 'dgp-zbet',
      'channel': 'Desktop',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

   

    return this.http.delete(`${this.notificationDelApiUrl}${id}`, { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  markAsSeen(apiUrl: string, notificationId: number): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': 'dgp-zbet',
      'channel': 'Desktop',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    const body = [ notificationId ]; // Adjust the body structure based on your API requirements

    return this.http.put(apiUrl, body, { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  flagNotification(apiUrl: string): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': 'dgp-zbet',
      'channel': 'Desktop',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    return this.http.put(apiUrl, null, { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  notificationMarkedAsSeen = new EventEmitter<void>();

  markNotificationAsSeen(apiUrl: string, notificationId: number): Observable<any> {
    return this.http.post<any>(apiUrl, { id: notificationId }).pipe(
      tap(() => {
        this.notificationMarkedAsSeen.emit();
      })
    );
  }

  private updateSubject = new BehaviorSubject<void>(null);
  update$ = this.updateSubject.asObservable();

  triggerUpdate(): void {
    this.updateSubject.next();
  }

}


