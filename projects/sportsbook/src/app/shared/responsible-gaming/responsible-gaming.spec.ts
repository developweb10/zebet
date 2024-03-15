import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleGamingComponent } from './responsible-gaming.component';

describe('ResponsibleGamingComponent', () => {
  let component: ResponsibleGamingComponent;
  let fixture: ComponentFixture<ResponsibleGamingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponsibleGamingComponent]
    });
    fixture = TestBed.createComponent(ResponsibleGamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});