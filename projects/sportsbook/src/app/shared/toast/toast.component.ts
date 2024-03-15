import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  constructor(public toast: ToastService ) { } 
  // We inject the toast.service here as 'public'  
  // We'll add this to the dismiss button in the template  
  closeToast(): void {    
    this.toast.dismissToast();  
  }
}
