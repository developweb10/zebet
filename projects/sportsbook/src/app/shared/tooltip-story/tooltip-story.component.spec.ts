import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipStoryComponent } from './tooltip-story.component';

describe('TooltipStoryComponent', () => {
  let component: TooltipStoryComponent;
  let fixture: ComponentFixture<TooltipStoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipStoryComponent]
    });
    fixture = TestBed.createComponent(TooltipStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
