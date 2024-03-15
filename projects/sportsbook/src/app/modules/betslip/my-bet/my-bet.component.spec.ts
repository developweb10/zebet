import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBetComponent } from './my-bet.component';

describe('MyBetComponent', () => {
  let component: MyBetComponent;
  let fixture: ComponentFixture<MyBetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyBetComponent]
    });
    fixture = TestBed.createComponent(MyBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
