import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateProgramComponent } from './affiliate-program.component';

describe('AffiliateProgramComponent', () => {
  let component: AffiliateProgramComponent;
  let fixture: ComponentFixture<AffiliateProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateProgramComponent]
    });
    fixture = TestBed.createComponent(AffiliateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
