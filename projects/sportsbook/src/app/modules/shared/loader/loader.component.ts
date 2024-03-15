import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  public show: boolean = false;
  isLoading: boolean;
  loaderEvent: Subscription;

  constructor(private loaderService: LoaderService) {
    this.init();
  }

  ngOnInit() {}

  init(): any {
    this.loaderEvent = this.loaderService.isLoading.subscribe(
      (res: boolean) => {
        this.isLoading = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.loaderEvent.unsubscribe();
  }
}
