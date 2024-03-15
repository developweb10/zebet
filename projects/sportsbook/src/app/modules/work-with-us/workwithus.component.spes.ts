import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkWithUsComponent } from './workwithus.component';

describe('WorkWithUsComponent', () => {
  let component: WorkWithUsComponent;
  let fixture: ComponentFixture<WorkWithUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkWithUsComponent]
    });
    fixture = TestBed.createComponent(WorkWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
