import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-webcam-image',
  templateUrl: './webcam-image.component.html',
  styleUrls: ['./webcam-image.component.css']
})
export class WebcamImageComponent implements OnInit {
  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();

  @Output() isCapturedImage = new EventEmitter<boolean>();
  @Output() imageCaptured = new EventEmitter<string>();
  @Input() width = 400;
  @Input() height = 400;
  sysImage = '';
  initializationErrors;
  ngOnInit() {}

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  
  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    this.imageCaptured.emit(this.sysImage);
    this.isCapturedImage.emit(true);
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    this.initializationErrors = error.message;
  }
}
