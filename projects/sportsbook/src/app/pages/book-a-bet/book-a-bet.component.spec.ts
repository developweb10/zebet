import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookABetComponent } from './book-a-bet.component';

describe('BookABetComponent', () => {
  let component: BookABetComponent;
  let fixture: ComponentFixture<BookABetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookABetComponent]
    });
    fixture = TestBed.createComponent(BookABetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
