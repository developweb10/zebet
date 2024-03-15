import { BehaviorSubject, Observable } from "rxjs";
import { TokenDetails } from "../modules/auth/login-details";
import { Injectable, inject } from "@angular/core";
import { LocalStorageService } from "../util/local-storage.service";
import { AuthFNCService } from "../auth-fnc.service";

@Injectable({
    providedIn: 'root'
  })
  export class TokenService { 

    private tokenBus$ = new BehaviorSubject<any>({});
    tokenDetails: TokenDetails;  

    TOKEN_KEY = "zebet_token_key";

    _localStorageService = inject(LocalStorageService);

    _authFNC = inject(AuthFNCService);


    getTokenDetails(): Observable<TokenDetails> {

        if(this._localStorageService.exists(this.TOKEN_KEY))
        this.tokenDetails = JSON.parse(this._localStorageService.get(this.TOKEN_KEY)!.data);
        this.tokenBus$.next(this.tokenDetails);

        return this.tokenBus$;
    }

    setTokenDetails(token: TokenDetails){
        this.tokenBus$.next(token);

        this._localStorageService.set(this.TOKEN_KEY,  JSON.stringify(token));

        this._authFNC.newToken(token.fnc_accessToken)
    }
  }
