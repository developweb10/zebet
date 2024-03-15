import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetSlipDesktopComponent } from './bet-slip-desktop.component';

describe('BetSlipDesktopComponent', () => {
  let component: BetSlipDesktopComponent;
  let fixture: ComponentFixture<BetSlipDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetSlipDesktopComponent]
    });
    fixture = TestBed.createComponent(BetSlipDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
