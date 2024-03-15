import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookABetDesktopComponent } from './book-a-bet-desktop.component';

describe('BookABetDesktopComponent', () => {
  let component: BookABetDesktopComponent;
  let fixture: ComponentFixture<BookABetDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookABetDesktopComponent]
    });
    fixture = TestBed.createComponent(BookABetDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
