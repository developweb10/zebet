import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGamingLimitComponent } from './add-gaming-limit.component';

describe('AddGamingLimitComponent', () => {
  let component: AddGamingLimitComponent;
  let fixture: ComponentFixture<AddGamingLimitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGamingLimitComponent]
    });
    fixture = TestBed.createComponent(AddGamingLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
