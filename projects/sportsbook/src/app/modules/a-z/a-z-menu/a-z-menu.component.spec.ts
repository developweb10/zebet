import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AZMenuComponent } from './a-z-menu.component';

describe('AZMenuComponent', () => {
  let component: AZMenuComponent;
  let fixture: ComponentFixture<AZMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AZMenuComponent]
    });
    fixture = TestBed.createComponent(AZMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
