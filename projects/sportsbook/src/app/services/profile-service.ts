import { BehaviorSubject, Observable } from "rxjs";
import { TokenDetails } from "../modules/auth/login-details";
import { Injectable, inject } from "@angular/core";
import { LocalStorageService } from "../util/local-storage.service";

@Injectable({
    providedIn: 'root'
  })
  export class ProfileService { 

    private profileBus$ = new BehaviorSubject<any>({});
    private stateDetails: boolean;

    getBackState(): Observable<boolean> {

        this.profileBus$.next(this.stateDetails);

        return this.profileBus$;
    }

    setBackState(state: boolean){
        this.stateDetails = state;
        this.profileBus$.next(state);
    }
  }
