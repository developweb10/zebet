import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBetslipDesktopComponent } from './book-betslip-desktop.component';

describe('BookBetslipDesktopComponent', () => {
  let component: BookBetslipDesktopComponent;
  let fixture: ComponentFixture<BookBetslipDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookBetslipDesktopComponent]
    });
    fixture = TestBed.createComponent(BookBetslipDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
