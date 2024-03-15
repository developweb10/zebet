import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMenuComponent } from './help-menu.component';

describe('HelpMenuComponent', () => {
  let component: HelpMenuComponent;
  let fixture: ComponentFixture<HelpMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpMenuComponent]
    });
    fixture = TestBed.createComponent(HelpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
