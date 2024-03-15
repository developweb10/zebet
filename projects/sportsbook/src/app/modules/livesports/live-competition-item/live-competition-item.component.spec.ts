import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCompetitionItemComponent } from './live-competition-item.component';

describe('LiveCompetitionItemComponent', () => {
  let component: LiveCompetitionItemComponent;
  let fixture: ComponentFixture<LiveCompetitionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveCompetitionItemComponent]
    });
    fixture = TestBed.createComponent(LiveCompetitionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
