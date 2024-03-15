import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositValidationPopUpComponent } from './deposit-validation-pop-up.component';

describe('DepositValidationPopUpComponent', () => {
  let component: DepositValidationPopUpComponent;
  let fixture: ComponentFixture<DepositValidationPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositValidationPopUpComponent]
    });
    fixture = TestBed.createComponent(DepositValidationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
