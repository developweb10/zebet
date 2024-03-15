import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CMStokenService {

  constructor() { }

  getAuthorizationHeader(): HttpHeaders {
    let token: string;
    if (window.location.href.includes("qa.zebet.link")) {
      token = environment.cmsQAToken;
    } else if (window.location.href.includes("uat.zebet.link")) {
      token = environment.cmsUATToken;
    } else if (window.location.href.includes("prod.zebet.link") || window.location.href.includes("zebet.ng")) {
      token = environment.cmsPRODToken;
    } else if (window.location.href.includes("localhost")) {
      token = environment.cmsQAToken;
    } else {
      token = ''; // Handle other cases or set default token
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
