import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitUpdateComponent } from './limit-update.component';

describe('LimitUpdateComponent', () => {
  let component: LimitUpdateComponent;
  let fixture: ComponentFixture<LimitUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LimitUpdateComponent]
    });
    fixture = TestBed.createComponent(LimitUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
