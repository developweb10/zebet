import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastStoryComponent } from './toast-story.component';

describe('ToastStoryComponent', () => {
  let component: ToastStoryComponent;
  let fixture: ComponentFixture<ToastStoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastStoryComponent]
    });
    fixture = TestBed.createComponent(ToastStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
