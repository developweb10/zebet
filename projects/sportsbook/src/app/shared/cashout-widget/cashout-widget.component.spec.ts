import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutWidgetComponent } from './cashout-widget.component';

describe('CashoutWidgetComponent', () => {
  let component: CashoutWidgetComponent;
  let fixture: ComponentFixture<CashoutWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashoutWidgetComponent]
    });
    fixture = TestBed.createComponent(CashoutWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
