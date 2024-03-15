import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTabComponent } from './button-tab.component';

describe('ButtonTabComponent', () => {
  let component: ButtonTabComponent;
  let fixture: ComponentFixture<ButtonTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonTabComponent]
    });
    fixture = TestBed.createComponent(ButtonTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
