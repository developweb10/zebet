import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaLockComponent } from './na-lock.component';

describe('NaLockComponent', () => {
  let component: NaLockComponent;
  let fixture: ComponentFixture<NaLockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NaLockComponent]
    });
    fixture = TestBed.createComponent(NaLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
