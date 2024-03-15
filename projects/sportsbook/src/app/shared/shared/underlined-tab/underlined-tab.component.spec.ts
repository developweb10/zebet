import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlinedTabComponent } from './underlined-tab.component';

describe('UnderlinedTabComponent', () => {
  let component: UnderlinedTabComponent;
  let fixture: ComponentFixture<UnderlinedTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnderlinedTabComponent]
    });
    fixture = TestBed.createComponent(UnderlinedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
