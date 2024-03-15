import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsBettingRuleComponent } from './Sportsbettingrule.component';

describe('SportsBettingRuleComponen', () => {
  let component: SportsBettingRuleComponent;
  let fixture: ComponentFixture<SportsBettingRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SportsBettingRuleComponent]
    });
    fixture = TestBed.createComponent(SportsBettingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
