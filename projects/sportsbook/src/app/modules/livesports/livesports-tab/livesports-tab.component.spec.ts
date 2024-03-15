import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivesportsTabComponent } from './livesports-tab.component';

describe('LivesportsTabComponent', () => {
  let component: LivesportsTabComponent;
  let fixture: ComponentFixture<LivesportsTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivesportsTabComponent]
    });
    fixture = TestBed.createComponent(LivesportsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
