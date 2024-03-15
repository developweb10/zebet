import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivedocComponent } from './livedoc.component';

describe('LivedocComponent', () => {
  let component: LivedocComponent;
  let fixture: ComponentFixture<LivedocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivedocComponent]
    });
    fixture = TestBed.createComponent(LivedocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
