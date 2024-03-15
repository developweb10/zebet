import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBetslipComponent } from './book-betslip.component';

describe('BookBetslipComponent', () => {
  let component: BookBetslipComponent;
  let fixture: ComponentFixture<BookBetslipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookBetslipComponent]
    });
    fixture = TestBed.createComponent(BookBetslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
