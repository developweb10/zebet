import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamImageComponent } from './webcam-image.component';

describe('WebcamImageComponent', () => {
  let component: WebcamImageComponent;
  let fixture: ComponentFixture<WebcamImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebcamImageComponent]
    });
    fixture = TestBed.createComponent(WebcamImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
