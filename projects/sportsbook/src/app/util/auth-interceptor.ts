import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector, inject } from "@angular/core";
import { TokenService } from "../services/token-service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router, Event as NavigationEvent, NavigationStart } from "@angular/router";
import { LoaderService } from "../services/loader.service";
import { BettingService } from '../services/betting-service';
import { environment } from "../../environments/environment";
import { UserBalanceService } from "../modules/header/header/balance.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authToken: any;
  private authReq: any
  event$: any;
  private bettingService: BettingService;
  private userBalanceService: UserBalanceService;
  private currentUrl: string;
  constructor(private tokenService: TokenService, private router: Router, private loaderService: LoaderService, private injector: Injector) {
    // this.tokenService.getTokenDetails()
    // .subscribe(tokenData => {
    //     this.authToken = tokenData.accessToken ?? "";
    //     console.log("testing TOken", this.authToken);
    // })

    setTimeout(() => {
      this.bettingService = this.injector.get(BettingService);
      this.userBalanceService = this.injector.get(UserBalanceService);
    })

    // this.authToken = localStorage.getItem('fnc_accessToken');

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.

    this.event$
      = this.router.events
        .subscribe(
          (event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
              this.currentUrl = event.url;

              if (this.currentUrl == '/auth/login-account')
                console.log("HeadRequest", event.url);
            }
          });


    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.

    // if(this.authToken)
    // {
    //     req = req.clone({
    //   headers: req.headers.set('Authorization', `Bearer ${this.authToken}`)
    // });
    // }

    // if (this.authToken !== null) {
    //   if (this.currentUrl == '/login-account' || this.currentUrl == '/auth/register-account') {
    //     if (!req.headers.has("Authorization")) {

    //       req = req.clone({
    //         headers: req.headers.set('Authorization', `Bearer ${this.authToken}`)
    //       });
    //     }

    //   }

    // }

    // if(req.url.includes(environment.cmsBaseUrl))
    // {
    //     req = req.clone({
    //       headers: req.headers.set('Authorization', `Bearer ${environment.cmsToken}`)
    //     });
    // }

    if(window.location.href.includes("qa.zebet.link"))
    {
      if(req.url.includes(environment.cmsBaseUrl))
      {
         //Clone for QA
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${environment.cmsQAToken}`)
        });
      }
        
    }
    else if(window.location.href.includes("uat.zebet.link"))
    {
      if(req.url.includes(environment.cmsBaseUrl))
      {
         //Clone for UAT
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${environment.cmsUATToken}`)
        });
      }
    }
    else if(window.location.href.includes("prod.zebet.link") || window.location.href.includes("zebet.ng"))
    {
      if(req.url.includes(environment.cmsBaseUrl))
      {
         //Clone for PROD
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${environment.cmsPRODToken}`)
        });
      }
    }
    else if(window.location.href.includes("localhost"))
    {
      if(req.url.includes(environment.cmsBaseUrl))
      {
        //Clone for LOCAL
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${environment.cmsQAToken}`)
        });

        console.log("HeaderReq", JSON.stringify(req))
      }
    }


    //console.log("HeadRequest", console.log(this.router.url))


    // send cloned request with header to the next handler.
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        //401 UNAUTHORIZED - SECTION 2
        if (error && error.status === 401) {
          console.log("ERROR 401 UNAUTHORIZED", error)
          this.loaderService.setLoggedIn(false)
          //implement refresh token
          localStorage.removeItem("fnc_accessToken");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("betBasketId");
          this.router.navigate(['/auth/login-account']);
          this.bettingService.setLoginStatus(true);
          this.userBalanceService.removeUserBalance();
        }
        //const err = error.error.message || error.statusText;
        return throwError(error);
      })
    );
  }
}