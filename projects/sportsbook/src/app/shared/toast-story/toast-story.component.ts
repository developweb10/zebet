import { Component } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-toast-story',
  templateUrl: './toast-story.component.html',
  styleUrls: ['./toast-story.component.css']
})
export class ToastStoryComponent {
  constructor(private toast: ToastService) { }
  showToast(type:string){
    this.toast.show(type,"Description. Lorem ipsum dolor sit amet.","Title");
   }
}
