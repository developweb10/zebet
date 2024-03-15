import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleButtonTabComponent } from './simple-button-tab.component';

describe('ButtonTabComponent', () => {
  let component: SimpleButtonTabComponent;
  let fixture: ComponentFixture<SimpleButtonTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleButtonTabComponent]
    });
    fixture = TestBed.createComponent(SimpleButtonTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
