import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsBannerComponent } from './sports-banner.component';

describe('SportsBannerComponent', () => {
  let component: SportsBannerComponent;
  let fixture: ComponentFixture<SportsBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportsBannerComponent]
    });
    fixture = TestBed.createComponent(SportsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
