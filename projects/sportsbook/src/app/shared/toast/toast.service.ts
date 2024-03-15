import { Injectable } from '@angular/core';
import { duration } from 'moment';
import { BehaviorSubject } from 'rxjs';

export const TOAST_STATE = {  
  info: 'info',
  success: 'success',  
  warning: 'warning',  
  error: 'error'
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public showsToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);  
  public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('Default Toast Message');
  public toastTitle$: BehaviorSubject<string> = new BehaviorSubject<string>('Title');  
  public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>(TOAST_STATE.success);  
  public toastDuration$: BehaviorSubject<number> = new BehaviorSubject<number>(5000);  

  constructor() { }  

  show(state: string, message: string, title?:string, duration?:number): void {  
    // Observables use '.next()' to indicate what they want done with observable    
    // This will update the toastState to the toastState passed into the function    ﻿
    this.toastState$.next(state);    

    // This updates the toastMessage to the toastMsg passed into the function    ﻿
    this.toastMessage$.next(message);    

    this.toastTitle$.next(title);    

    // This will update the showsToast trigger to 'true'
    this.showsToast$.next(true);   

    if (duration != undefined)
    {
      this.toastDuration$.next(duration);
    }
    else
    {
      this.toastDuration$.next(5000);
    }
    if (this.toastDuration$.value > 0)
    {
      setTimeout(() => {
        this.showsToast$.next(false);   
      }, this.toastDuration$.value);
    }
}  

  info(message: string, title?:string, duration?:number): void {  
    this.show(TOAST_STATE.info, message, title, duration);
  }  

  success(message: string, title?:string, duration?:number): void {  
    this.show(TOAST_STATE.success, message, title, duration);
  }  

  warning(message: string, title?:string, duration?:number): void {  
    this.show(TOAST_STATE.warning, message, title, duration);
  }  

  error(message: string, title?:string, duration?:number): void {  
    this.show(TOAST_STATE.error, message, title, duration);
  }  

  // This updates the showsToast behavioursubject to 'false'  
  dismissToast(): void {    
    this.showsToast$.next(false);  
  }
}