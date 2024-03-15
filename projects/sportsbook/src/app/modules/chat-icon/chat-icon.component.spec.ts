import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatIconComponent } from './chat-icon.component';

describe('ChatIconComponent', () => {
  let component: ChatIconComponent;
  let fixture: ComponentFixture<ChatIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatIconComponent]
    });
    fixture = TestBed.createComponent(ChatIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
