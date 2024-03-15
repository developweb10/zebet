import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZbetLeagueComponent } from './zbet-league.component';

describe('ZbetLeagueComponent', () => {
  let component: ZbetLeagueComponent;
  let fixture: ComponentFixture<ZbetLeagueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZbetLeagueComponent]
    });
    fixture = TestBed.createComponent(ZbetLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
