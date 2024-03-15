import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFNCService {

  private tokenSubject = new ReplaySubject<string>(1);

  token$ = this.tokenSubject.asObservable();

  newToken(token: string) {
    this.tokenSubject.next(token);
  }

}
