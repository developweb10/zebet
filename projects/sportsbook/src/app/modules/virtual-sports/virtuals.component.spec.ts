import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualsComponent } from './virtuals.component';

describe('VirtualsComponent', () => {
  let component: VirtualsComponent;
  let fixture: ComponentFixture<VirtualsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualsComponent]
    });
    fixture = TestBed.createComponent(VirtualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
