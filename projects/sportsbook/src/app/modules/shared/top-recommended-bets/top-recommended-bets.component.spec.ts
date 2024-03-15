import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRecommendedBetsComponent } from './top-recommended-bets.component';

describe('TopRecommendedBetsComponent', () => {
  let component: TopRecommendedBetsComponent;
  let fixture: ComponentFixture<TopRecommendedBetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopRecommendedBetsComponent]
    });
    fixture = TestBed.createComponent(TopRecommendedBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
