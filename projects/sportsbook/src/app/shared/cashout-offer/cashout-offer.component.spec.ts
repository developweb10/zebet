import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutOfferComponent } from './cashout-offer.component';

describe('CashoutOfferComponent', () => {
  let component: CashoutOfferComponent;
  let fixture: ComponentFixture<CashoutOfferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashoutOfferComponent]
    });
    fixture = TestBed.createComponent(CashoutOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
