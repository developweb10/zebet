import { Injectable } from "@angular/core";
import { LocalStorageRefService } from "./local-storage-ref.service";
import { BehaviorSubject } from "rxjs";
import * as moment from "moment";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
   private _localStorage: Storage;

//    private _myData$ = new BehaviorSubject<StorageObj | null>({})
//    public myData$ = this._myData$.asObservable();

   constructor(private _localStorageRefService: LocalStorageRefService) {
      this._localStorage = _localStorageRefService.localStorage
   }

   set(key: string, data: any) {
    const now = new Date();

    const storageObj: StorageObj = {
        expiry: now.getTime() + environment.dataExpiry * 60 * 60 * 1000,
        data
    };
    const jsonData = JSON.stringify(storageObj)
    this._localStorage.setItem(key + '_dashboard', jsonData);
   
    }
    

    get(key: string) {

        const now = new Date();
        const data: StorageObj = JSON.parse(this._localStorage.getItem(key + '_dashboard')!);
        // console.log('data bet', data)
        if(!data)
        return null
        if(!data.expiry)
        return null

        // console.log("Local storage Expiry - " + data.expiry);
        if (now.getTime() > data.expiry) {
            this._localStorage.removeItem(key)
            return null
        }

        return data;
    }

    exists(key: string): boolean {

        const now = new Date();
        
        const data: StorageObj = JSON.parse(this._localStorage.getItem(key + '_dashboard')!);
        
        if(!data)
        return false;
        if(!data.expiry)
        return false;

        if (now.getTime() > data.expiry) {
            this._localStorage.removeItem(key)
            return false
        }

        return true;
    }

    clear(key: string) {
        this._localStorage.removeItem(key + '_dashboard')
        return null;
    }

    clearAllLocalStorage() {
        this._localStorage.clear()
        return null;
    }
}

export interface StorageObj {
    data?: any;
    expiry?: any;
}