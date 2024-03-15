import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualComponent } from './virtual.component';

describe('VirtualComponent', () => {
  let component: VirtualComponent;
  let fixture: ComponentFixture<VirtualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualComponent]
    });
    fixture = TestBed.createComponent(VirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
