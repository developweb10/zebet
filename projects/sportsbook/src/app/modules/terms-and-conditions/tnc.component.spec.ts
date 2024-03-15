import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TNCComponent } from './tnc.component';

describe('TNCComponent', () => {
  let component: TNCComponent;
  let fixture: ComponentFixture<TNCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TNCComponent]
    });
    fixture = TestBed.createComponent(TNCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
